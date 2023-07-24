import { Injectable, LoggerService } from '@nestjs/common'
import { Console } from '@esliph/util-node'

export class ConsoleLogger extends Console {
    constructor(args?: { context?: string }) {
        super({ methodsValue: { ...args, pidName: CONSOLE_PID_NAME } })
    }
}

export const CONSOLE_PID_NAME = 'App'
const CONTEXT_APP_LOGGER = 'AppNest'

@Injectable()
export class ConsoleLoggerNest implements LoggerService {
    private console = new ConsoleLogger()

    log(message: any, context: any) {
        // this.console.log(message, null, { context: `[${CONTEXT_APP_LOGGER}:${context}]` })
    }
    error(message: any, context: any, _context: any) {
        this.console.error(message, null, { context: `[${CONTEXT_APP_LOGGER}:${_context || context}]` })
    }
    warn(message: any, context: any) {
        this.console.warn(message, null, { context: `[${CONTEXT_APP_LOGGER}:${context}]` })
    }
    debug?(message: any, context: any) {
        this.console.info(message, null, { context: `[${CONTEXT_APP_LOGGER}:${context}]` })
    }
}
