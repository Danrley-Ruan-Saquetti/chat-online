import { NestFactory } from '@nestjs/core'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import { FastifyPluginAsync, FastifyPluginCallback, FastifyPluginOptions, FastifyRegisterOptions } from 'fastify'
import fastifyCsrf from '@fastify/csrf-protection'
import fastifyHelmet from '@fastify/helmet'
import fastifyCompression from '@fastify/compress'
import fastifyCookie from '@fastify/cookie'
import { ObserverEvent } from '@esliph/util-node'
import { getEnv } from '@services/env'
import { MainModule } from '@main.module'
import { AppEvents } from '@@types/events.d'
import { ConsoleLogger } from '@services/console'
import { OPTIONS_NEST_APPLICATION } from '@config/nest'

const OBSERVER_CONTEXT = 'AppServer'
const PORT = getEnv({ name: 'PORT', defaultValue: 8080 })

export class AppCore {
    private static appNest: NestFastifyApplication
    private static observer: ObserverEvent<typeof OBSERVER_CONTEXT, AppEvents>
    private static console: ConsoleLogger

    static async factory() {
        await this.createAppCore()
        await this.initComponents()
    }

    private static async createAppCore() {
        const { console, appNest, observer } = await this.createAppAndConsoleAndObserver()

        this.appNest = appNest
        this.console = console
        this.observer = observer
    }

    private static async createAppAndConsoleAndObserver() {
        const console = new ConsoleLogger({ context: `[${OBSERVER_CONTEXT}]` })
        const observer = new ObserverEvent<typeof OBSERVER_CONTEXT, AppEvents>(OBSERVER_CONTEXT)
        const appNest = await NestFactory.create<NestFastifyApplication>(MainModule, new FastifyAdapter(), OPTIONS_NEST_APPLICATION)

        return { appNest, console, observer }
    }

    private static async initComponents() {
        this.initObserver()
        await this.initComponentsFactory()
    }

    private static initObserver() {
        AppCore.on('error', err => {
            console.log(err)
        })
    }

    private static async initComponentsFactory() {
        await this.registerInApp(fastifyCompression, { encodings: ['gzip', 'deflate'] })
        await this.registerInApp(fastifyCookie, { secret: 'my-secret' })
        await this.registerInApp(fastifyCsrf)
        await this.registerInApp(fastifyHelmet)
        await this.performListen()
    }

    public static async closeApp() {
        await this.appNest.close()
    }

    private static async performListen() {
        await this.appNest.listen(PORT)

        const url = await this.getUrl()


        this.console.log(`Server running on node environment=${getEnv({ name: 'NODE_ENV', defaultValue: 'local' })} on ${url}\n`)
    }

    private static async getUrl() {
        const url = await this.appNest.getUrl()

        return url
    }

    private static async registerInApp<Options extends FastifyPluginOptions = any>(plugin: FastifyPluginCallback<Options> | FastifyPluginAsync<Options> | Promise<{ default: FastifyPluginCallback<Options> }> | Promise<{ default: FastifyPluginAsync<Options> }>, opts?: FastifyRegisterOptions<Options>) {
        // @ts-expect-error
        await this.appNest.register(plugin, opts)
    }

    static on<Event extends keyof AppEvents>(eventName: Event, handler: (data: AppEvents[Event]) => void) {
        return this.observer.on(eventName, handler)
    }

    static async emit<Event extends keyof AppEvents>(eventName: Event, data: AppEvents[Event]) {
        await this.observer.emitToEvent(eventName, data)
    }

    static log(message: any, context: any) {
        AppCore.console.log(message, null, { context: `[${context}]` })
    }

    static error(message: any, context: any) {
        AppCore.console.error(message, null, { context: `[${context}]` })
    }

    static warn(message: any, context: any) {
        AppCore.console.warn(message, null, { context: `[${context}]` })
    }

    static debug?(message: any, context: any) {
        AppCore.console.info(message, null, { context: `[${context}]` })
    }
}
