import { Injectable } from '@nestjs/common'
import { Result } from '@esliph/util-node'
import {
    UserModelTableRepositoryAbstract,
    UserFindFirstArgs,
    UserFindFirstResponse,
    UserFindManyArgs,
    UserFindManyResponse,
    UserFindFirstOrThrowArgs,
    UserFindFirstOrThrowResponse,
    UserFindUniqueOrThrowArgs,
    UserFindUniqueOrThrowResponse,
    UserFindUniqueArgs,
    UserFindUniqueResponse,
    UserExistsArgs,
    UserExistsResponse
} from '@modules/user/repository/repository'

export abstract class UserFindUniqueRepositoryAbstract {
    perform: <Args extends UserFindUniqueArgs>(args: Args) => Promise<Result<UserFindUniqueResponse<Args>>>
}

@Injectable()
export class UserFindUniqueRepository implements UserFindUniqueRepositoryAbstract {
    constructor(private readonly repository: UserModelTableRepositoryAbstract) {}

    async perform<Args extends UserFindUniqueArgs>(args: Args): Promise<Result<UserFindUniqueResponse<Args>>> {
        const response = await this.repository.findUnique(args)

        return response
    }
}

export abstract class UserFindExistsRepositoryAbstract {
    perform: <Args extends UserExistsArgs>(args: Args) => Promise<Result<UserExistsResponse>>
}

@Injectable()
export class UserFindExistsRepository implements UserFindExistsRepositoryAbstract {
    constructor(private readonly repository: UserModelTableRepositoryAbstract) {}

    async perform<Args extends UserExistsArgs>(args: Args): Promise<Result<UserExistsResponse>> {
        const response = await this.repository.findExists(args)

        return response
    }
}

export abstract class UserFindFirstRepositoryAbstract {
    perform: <Args extends UserFindFirstArgs>(args: Args) => Promise<Result<UserFindFirstResponse<Args>>>
}

@Injectable()
export class UserFindFirstRepository implements UserFindFirstRepositoryAbstract {
    constructor(private readonly repository: UserModelTableRepositoryAbstract) {}

    async perform<Args extends UserFindFirstArgs>(args: Args): Promise<Result<UserFindFirstResponse<Args>>> {
        const response = await this.repository.findFirst(args)

        return response
    }
}

export abstract class UserFindManyRepositoryAbstract {
    perform: <Args extends UserFindManyArgs>(args: Args) => Promise<Result<UserFindManyResponse<Args>>>
}

@Injectable()
export class UserFindManyRepository implements UserFindManyRepositoryAbstract {
    constructor(private readonly repository: UserModelTableRepositoryAbstract) {}

    async perform<Args extends UserFindManyArgs>(args: Args): Promise<Result<UserFindManyResponse<Args>>> {
        const response = await this.repository.findMany(args)

        return response
    }
}

export abstract class UserFindFirstOrThrowRepositoryAbstract {
    perform: <Args extends UserFindFirstOrThrowArgs>(args: Args) => Promise<Result<UserFindFirstOrThrowResponse<Args>>>
}

@Injectable()
export class UserFindFirstOrThrowRepository implements UserFindFirstOrThrowRepositoryAbstract {
    constructor(private readonly repository: UserModelTableRepositoryAbstract) {}

    async perform<Args extends UserFindFirstOrThrowArgs>(args: Args): Promise<Result<UserFindFirstOrThrowResponse<Args>>> {
        const response = await this.repository.findFirstOrThrow(args)

        return response
    }
}

export abstract class UserFindUniqueOrThrowRepositoryAbstract {
    perform: <Args extends UserFindUniqueOrThrowArgs>(args: Args) => Promise<Result<UserFindUniqueOrThrowResponse<Args>>>
}

@Injectable()
export class UserFindUniqueOrThrowRepository implements UserFindUniqueOrThrowRepositoryAbstract {
    constructor(private readonly repository: UserModelTableRepositoryAbstract) {}

    async perform<Args extends UserFindUniqueOrThrowArgs>(args: Args): Promise<Result<UserFindUniqueOrThrowResponse<Args>>> {
        const response = await this.repository.findUniqueOrThrow(args)

        return response
    }
}
