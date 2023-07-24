import { Result, ResultEsliph } from '@esliph/util-node'

export class ResultException<T> extends Result<T> {
    constructor(error: ResultEsliph.ResultModel<T>['error'], status: ResultEsliph.ResultModel<T>['status']) {
        super({ ok: false, value: null, error, status })
    }
}
