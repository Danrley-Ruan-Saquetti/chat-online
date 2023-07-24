import { Injectable } from '@nestjs/common'
import { Result, HttpEsliph } from '@esliph/util-node'

@Injectable()
export class AppService {
    constructor() { }

    home() {
        return Result.success({ ok: true }, HttpEsliph.HttpStatusCodes.OK)
    }

    pingPong() {
        return Result.success({ ping: 'pong' }, HttpEsliph.HttpStatusCodes.OK)
    }
}
