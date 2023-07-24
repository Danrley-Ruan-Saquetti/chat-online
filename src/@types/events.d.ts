import { ErrorEsliph } from '@esliph/util-node'

export type AppEvents = {
    error: ErrorEsliph.ErrorResult & { origin?: string; errorOriginal?: any },
    teste: any,
}
