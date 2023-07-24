import { HttpException } from '@nestjs/common'
import { HttpEsliph, ResultEsliph } from '@esliph/util-node'

export class UnauthorizedException extends HttpException {
    constructor(error: ResultEsliph.ResultModel['error'] = { message: [{ message: 'Access Unauthorized' }], title: 'Authentication' }) {
        super({ ok: false, status: HttpEsliph.HttpStatusCodes.UNAUTHORIZED, value: null, error }, HttpEsliph.HttpStatusCodes.UNAUTHORIZED)
    }
}
