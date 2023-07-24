import { Injectable } from '@nestjs/common'
import { HttpEsliph, Result } from '@esliph/util-node'
import { z } from 'zod'
import { ZodValidateService } from '@services/zod'
import { UserFindManyRepositoryAbstract } from '@modules/user/repository/find.repository'
import { UserPropSelect } from '@modules/user/repository/repository'
import { ResultException } from '@util/exceptions/result.exception'

export class UserListUseCaseDTO {
    /* Implement the properties that the use case requires in the parameters */
}

export const UserListUseCaseArgsSchema = z.object({})

const UserPropsSelected = {
    id: true,
    email: true,
    username: true,
    createAt: true
}

export type UserListUseCaseArgs = z.input<typeof UserListUseCaseArgsSchema>
export type UserListUseCaseResponse = z.output<typeof UserListUseCaseArgsSchema>
export type UserListCasePerformResponseValue = { users: UserPropSelect<{ select: typeof UserPropsSelected }>[] }
export type UserListCasePerformResponse = Promise<Result<UserListCasePerformResponseValue>>

@Injectable()
export class UserListUseCase {
    constructor(private readonly listUserRepository: UserFindManyRepositoryAbstract) { }

    async perform(listArgs: UserListUseCaseArgs): UserListCasePerformResponse {
        try {
            const responsePerform = await this.performList(listArgs)

            return responsePerform
        } catch (err: any) {
            if (err instanceof ResultException) {
                return err
            }
            return Result.failure({ title: 'Create User', message: [{ message: 'Cannot create user' }] }, HttpEsliph.HttpStatusCodes.BAD_REQUEST)
        }
    }

    private async performList(listArgs: UserListUseCaseArgs): UserListCasePerformResponse {
        const listArgsValidationResult = this.validateArgsProps(listArgs)

        const listArgsDTO = listArgsValidationResult.getValue()

        const performListRepositoryResult = await this.performListRepository(listArgsDTO)

        if (!performListRepositoryResult.isSuccess()) {
            return Result.failure(performListRepositoryResult.getError(), performListRepositoryResult.getStatus())
        }

        return Result.success<UserListCasePerformResponseValue>(performListRepositoryResult.getValue(), performListRepositoryResult.getStatus())
    }

    private validateArgsProps(listArgs: UserListUseCaseArgs) {
        const userListDTO = ZodValidateService.performParse(listArgs, UserListUseCaseArgsSchema)

        return userListDTO
    }

    private async performListRepository(listArgs: UserListUseCaseArgs) {
        const response = await this.listUserRepository.perform({ where: listArgs, select: UserPropsSelected })

        return response
    }
}
