import { getEnv as env, VarEnvEsliph, FlagEsliph } from '@esliph/util-node'

const VARS: { [x in string]: string } = {
    'NODE_ENV': FlagEsliph.getFlag('--env'),
    'PORT': FlagEsliph.getFlag('--port'),
}

export function getEnv<DefaultType>(args: VarEnvEsliph.GetEnvArgs<DefaultType>) {
    return env({ ...args, defaultValue: VARS[args.name] || args.defaultValue })
}
