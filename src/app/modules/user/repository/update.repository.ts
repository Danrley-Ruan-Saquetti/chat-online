import { Injectable } from '@nestjs/common'
import { Result } from '@esliph/util-node'
import {
    UserModelTableRepositoryAbstract,
    UserUpdateResponse,
    UserUpdateArgs,
    UserUpdateManyResponse,
    UserUpdateManyArgs
} from '@modules/user/repository/repository'

export abstract class UserUpdateRepositoryAbstract {
    perform: (args: UserUpdateArgs) => Promise<Result<UserUpdateResponse>>
}

@Injectable()
export class UserUpdateRepository implements UserUpdateRepositoryAbstract {
    constructor(private readonly repository: UserModelTableRepositoryAbstract) {}

    async perform(args: UserUpdateArgs): Promise<Result<UserUpdateResponse>> {
        const response = await this.repository.update(args)

        return response
    }
}

export abstract class UserUpdateManyRepositoryAbstract {
    perform: (args: UserUpdateManyArgs) => Promise<Result<UserUpdateManyResponse>>
}

@Injectable()
export class UserUpdateManyRepository implements UserUpdateManyRepositoryAbstract {
    constructor(private readonly repository: UserModelTableRepositoryAbstract) {}

    async perform(args: UserUpdateManyArgs): Promise<Result<UserUpdateManyResponse>> {
        const response = await this.repository.updateMany(args)

        return response
    }
}
