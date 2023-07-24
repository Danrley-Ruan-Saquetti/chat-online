import { NestApplicationOptions } from '@nestjs/common'
import { ConfigModule, ConfigModuleOptions } from '@nestjs/config'
import { ConsoleLoggerNest } from '@services/console'

const CONFIG_GLOBAL_MODULE: ConfigModuleOptions = {
    isGlobal: true,
}

export const CONFIG_NEST_MODULE_ROOT = ConfigModule.forRoot(CONFIG_GLOBAL_MODULE)

export const OPTIONS_NEST_APPLICATION: NestApplicationOptions = {
    logger: new ConsoleLoggerNest(),
    abortOnError: false,
    cors: true,
    bufferLogs: true
}
