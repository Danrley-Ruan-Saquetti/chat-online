import { UserDependencies } from '@modules/user/user.dependencies'
import { Global, Module, Provider } from '@nestjs/common'
import { UserDeleteUseCase } from '@modules/user/use-case/delete.use-case'
import { UserListUseCase } from '@modules/user/use-case/list.use-case'
import { UserUpdateUseCase } from '@modules/user/use-case/update.use-case'
import { UserFindOneUseCase } from '@modules/user/use-case/find-one.use-case'
import { UserCreateUseCase } from '@modules/user/use-case/create.use-case'

const userServicesUseCase: Provider[] = [
    ...UserDependencies,
    UserCreateUseCase,
    UserListUseCase,
    UserUpdateUseCase,
    UserDeleteUseCase,
    UserFindOneUseCase
]

@Global()
@Module({
    providers: [...userServicesUseCase],
    exports: [...userServicesUseCase]
})
export class UserUseCaseModule { }
