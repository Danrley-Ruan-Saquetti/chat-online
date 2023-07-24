import { HttpException } from '@nestjs/common'
import { HttpEsliph, ResultEsliph } from '@esliph/util-node'

export class BadRequestException extends HttpException {
    constructor(error: ResultEsliph.ResultModel['error']) {
        super({ ok: false, status: HttpEsliph.HttpStatusCodes.BAD_REQUEST, value: null, error }, HttpEsliph.HttpStatusCodes.BAD_REQUEST)
    }
}
