import { Provider } from '@nestjs/common'
import { UserCreateManyRepositoryAbstract, UserCreateManyRepository, UserCreateRepositoryAbstract, UserCreateRepository } from '@modules/user/repository/create.repository'
import { UserDeleteManyRepositoryAbstract, UserDeleteManyRepository, UserDeleteRepositoryAbstract, UserDeleteRepository } from '@modules/user/repository/delete.repository'
import { UserFindExistsRepositoryAbstract, UserFindExistsRepository, UserFindFirstOrThrowRepositoryAbstract, UserFindFirstOrThrowRepository, UserFindFirstRepositoryAbstract, UserFindFirstRepository, UserFindManyRepositoryAbstract, UserFindManyRepository, UserFindUniqueOrThrowRepositoryAbstract, UserFindUniqueOrThrowRepository, UserFindUniqueRepositoryAbstract, UserFindUniqueRepository } from '@modules/user/repository/find.repository'
import { UserModelTableRepositoryAbstract, UserModelTableRepository } from '@modules/user/repository/repository'
import { UserUpdateManyRepositoryAbstract, UserUpdateManyRepository, UserUpdateRepositoryAbstract, UserUpdateRepository } from '@modules/user/repository/update.repository'

export const UserDependencies: Provider[] = [
    {
        provide: UserModelTableRepositoryAbstract,
        useClass: UserModelTableRepository
    },
    {
        provide: UserCreateManyRepositoryAbstract,
        useClass: UserCreateManyRepository
    },
    {
        provide: UserCreateRepositoryAbstract,
        useClass: UserCreateRepository
    },
    {
        provide: UserUpdateManyRepositoryAbstract,
        useClass: UserUpdateManyRepository
    },
    {
        provide: UserUpdateRepositoryAbstract,
        useClass: UserUpdateRepository
    },
    {
        provide: UserDeleteManyRepositoryAbstract,
        useClass: UserDeleteManyRepository
    },
    {
        provide: UserDeleteRepositoryAbstract,
        useClass: UserDeleteRepository
    },
    {
        provide: UserFindExistsRepositoryAbstract,
        useClass: UserFindExistsRepository
    },
    {
        provide: UserFindFirstOrThrowRepositoryAbstract,
        useClass: UserFindFirstOrThrowRepository
    },
    {
        provide: UserFindFirstRepositoryAbstract,
        useClass: UserFindFirstRepository
    },
    {
        provide: UserFindManyRepositoryAbstract,
        useClass: UserFindManyRepository
    },
    {
        provide: UserFindUniqueOrThrowRepositoryAbstract,
        useClass: UserFindUniqueOrThrowRepository
    },
    {
        provide: UserFindUniqueRepositoryAbstract,
        useClass: UserFindUniqueRepository
    }
]
