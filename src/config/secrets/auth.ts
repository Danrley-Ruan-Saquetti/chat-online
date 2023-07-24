import { RandomEsliph } from '@esliph/util-node'
import { getEnv } from '@services/env'

export const AUTH_SECRET = getEnv({ name: 'SERVER_HASH_SECRET', defaultValue: RandomEsliph.randomIduuidV4({}) })
