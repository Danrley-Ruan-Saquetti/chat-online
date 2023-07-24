import { AppModule } from '@app.module'
import { CONFIG_JWT_MODULE_ROOT } from '@config/jwt'
import { Global, Module, Provider } from '@nestjs/common'
import { CONFIG_NEST_MODULE_ROOT } from '@config/nest'
import { CONFIG_AXIOS_HTTP_MODULE_ROOT } from '@config/axios'
import { DatabaseService, PrismaService } from '@services/database'

const MainModuleServices: Provider[] = []

const MainModuleDependencies: Provider[] = [
    {
        provide: DatabaseService,
        useClass: PrismaService
    }
]

@Global()
@Module({
    imports: [
        CONFIG_NEST_MODULE_ROOT,
        CONFIG_AXIOS_HTTP_MODULE_ROOT,
        CONFIG_JWT_MODULE_ROOT,
        AppModule,
    ],
    controllers: [],
    providers: [...MainModuleDependencies, ...MainModuleServices],
    exports: [...MainModuleDependencies, ...MainModuleServices]
})
export class MainModule { }
