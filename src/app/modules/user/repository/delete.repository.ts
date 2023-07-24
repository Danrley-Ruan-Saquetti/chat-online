import { Injectable } from '@nestjs/common'
import { Result } from '@esliph/util-node'
import {
    UserModelTableRepositoryAbstract,
    UserDeleteArgs,
    UserDeleteResponse,
    UserDeleteManyArgs,
    UserDeleteManyResponse
} from '@modules/user/repository/repository'

export abstract class UserDeleteRepositoryAbstract {
    perform: (args: UserDeleteArgs) => Promise<Result<UserDeleteResponse>>
}

@Injectable()
export class UserDeleteRepository implements UserDeleteRepositoryAbstract {
    constructor(private readonly repository: UserModelTableRepositoryAbstract) {}

    async perform(args: UserDeleteArgs): Promise<Result<UserDeleteResponse>> {
        const response = await this.repository.delete(args)

        return response
    }
}

export abstract class UserDeleteManyRepositoryAbstract {
    perform: (args: UserDeleteManyArgs) => Promise<Result<UserDeleteManyResponse>>
}

@Injectable()
export class UserDeleteManyRepository implements UserDeleteManyRepositoryAbstract {
    constructor(private readonly repository: UserModelTableRepositoryAbstract) {}

    async perform(args: UserDeleteManyArgs): Promise<Result<UserDeleteManyResponse>> {
        const response = await this.repository.deleteMany(args)

        return response
    }
}
