import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common'
import { Prisma, PrismaClient } from '@prisma/client'
import { getEnv } from '@esliph/util-node'
import { AppCore } from '@core'

export abstract class DatabaseService extends PrismaClient { }
export abstract class DatabaseExceptionAbstract extends Prisma.PrismaClientKnownRequestError { }

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, DatabaseService {
    constructor() {
        super({
            log: [
                { emit: 'event', level: 'error' },
                { emit: 'event', level: 'info' },
                { emit: 'event', level: 'query' },
                { emit: 'event', level: 'warn' }
            ]
        })

        this.initComponent()
    }

    async onModuleInit() {
        try {
            await this.$connect()

            AppCore.log('Database connected successfully', 'Database')
        } catch (err: Prisma.PrismaClientKnownRequestError | any) {
            AppCore.emit('error', {
                origin: 'Database',
                title: 'Connection Database',
                message: [{ message: 'Database connection failed', origin: 'ConnectionDatabase' }],
                errorOriginal: err
            })

            if (getEnv({ name: 'NODE_ENV' }) == 'production') {
                await this.$disconnect()
            }
        }
    }

    async enableShutdownHooks(app: INestApplication) {
        // @ts-expect-error
        this.$on('beforeExit', async () => {
            await AppCore.closeApp()
        })
    }

    private initComponent() {
        // @ts-expect-error
        this.$on('error', (ev: any) => {
            AppCore.emit('error', {
                title: 'DatabaseQuery',
                origin: 'Database:Service',
                message: [{ message: ev.message, ...(ev.meta?.target && { origin: ev.meta.target.join(';') }) }],
                errorOriginal: ev
            })
        })
        // @ts-expect-error
        this.$on('info', (ev: any) => {
            // AppCore.console.log(ev, null, { context: '[DatabaseEvent]' })
        })
        // @ts-expect-error
        this.$on('query', ev => {
            // AppCore.console.log(ev.message, null, { context: '[DatabaseEvent]' })
        })
        // @ts-expect-error
        this.$on('warn', (ev: any) => {
            // AppCore.console.warn(ev.message, null, { context: '[DatabaseEvent]' })
        })
    }
}
