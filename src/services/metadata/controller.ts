import { ExecutionContext, Injectable, SetMetadata, Type } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import console from 'console'

@Injectable()
export class MetadataControl {
    constructor(private readonly reflector: Reflector) { }

    set<T>(key: string, ...values: T[]) {
        return SetMetadata(key, values)
    }

    get<T>(key: string, context: ExecutionContext) {
        const privileges = this.reflector.get<T[]>(key, context.getHandler()) ?? []

        return privileges
    }

    getAllAndOverride<TResult = any, TKey = any>(metadataKey: TKey, targets: (Type<any> | Function)[]) {
        const result = this.reflector.getAllAndOverride<TResult, TKey>(metadataKey, targets)

        return result
    }
}
