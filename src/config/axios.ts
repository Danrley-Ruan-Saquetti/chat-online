import { HttpModule, HttpModuleOptions } from '@nestjs/axios'

const CONFIG_AXIOS_HTTP_MODULE: HttpModuleOptions = {
    timeout: 5000,
    maxRedirects: 5
}

export const CONFIG_AXIOS_HTTP_MODULE_ROOT = HttpModule.register(CONFIG_AXIOS_HTTP_MODULE)
