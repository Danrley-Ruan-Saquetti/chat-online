import { MiddlewareConsumer, Module, NestModule, Provider } from '@nestjs/common'
import { UserController } from '@modules/user/user.controller'
import { UserUseCaseModule } from '@modules/user/use-case.module'
import { UserService } from '@modules/user/user.service'

const UserModuleServices: Provider[] = [UserService]

@Module({
    imports: [
        UserUseCaseModule
    ],
    controllers: [
        UserController
    ],
    providers: [
        ...UserModuleServices,
    ],
    exports: [
        ...UserModuleServices
    ]
})
export class UserModule implements NestModule {
    configure(consumer: MiddlewareConsumer) { }
}
