import { Injectable } from '@nestjs/common'
import { Result } from '@esliph/util-node'
import {
    UserModelTableRepositoryAbstract,
    UserCreateArgs,
    UserCreateManyArgs,
    UserCreateResponse,
    UserCreateManyResponse
} from '@modules/user/repository/repository'

export abstract class UserCreateRepositoryAbstract {
    perform: (args: UserCreateArgs) => Promise<Result<UserCreateResponse>>
}

@Injectable()
export class UserCreateRepository implements UserCreateRepositoryAbstract {
    constructor(private readonly repository: UserModelTableRepositoryAbstract) {}

    async perform(args: UserCreateArgs): Promise<Result<UserCreateResponse>> {
        const response = await this.repository.create(args)

        return response
    }
}

export abstract class UserCreateManyRepositoryAbstract {
    perform: (args: UserCreateManyArgs) => Promise<Result<UserCreateManyResponse>>
}

@Injectable()
export class UserCreateManyRepository implements UserCreateManyRepositoryAbstract {
    constructor(private readonly repository: UserModelTableRepositoryAbstract) {}

    async perform(args: UserCreateManyArgs): Promise<Result<UserCreateManyResponse>> {
        const response = await this.repository.createMany(args)

        return response
    }
}
