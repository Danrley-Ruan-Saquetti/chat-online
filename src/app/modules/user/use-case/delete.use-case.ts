import { Injectable } from '@nestjs/common'
import { HttpEsliph, Result } from '@esliph/util-node'
import { z } from 'zod'
import { ZodValidateService } from '@services/zod'
import { UserDeleteRepositoryAbstract } from '@modules/user/repository/delete.repository'
import { ResultException } from '@util/exceptions/result.exception'

export class UserDeleteUseCaseDTO { }

export const UserDeleteUseCaseArgsSchema = ZodValidateService.defaultSchemaModelTable()

export type UserDeleteUseCaseArgs = z.input<typeof UserDeleteUseCaseArgsSchema>
export type UserDeleteUseCaseResponse = z.output<typeof UserDeleteUseCaseArgsSchema>
export type UserDeleteUseCasePerformResponseValue = boolean
export type UserDeleteUseCasePerformResponse = Promise<Result<UserDeleteUseCasePerformResponseValue>>

@Injectable()
export class UserDeleteUseCase {
    constructor(private readonly deleteUserRepository: UserDeleteRepositoryAbstract) { }

    async perform(deleteArgs: UserDeleteUseCaseArgs): UserDeleteUseCasePerformResponse {
        try {
            const responsePerform = await this.performDelete(deleteArgs)

            return responsePerform
        } catch (err: any) {
            if (err instanceof ResultException) {
                return err
            }
            return Result.failure({ title: 'Delete User', message: [{ message: 'Cannot delete user' }] }, HttpEsliph.HttpStatusCodes.BAD_REQUEST)
        }
    }

    private async performDelete(deleteArgs: UserDeleteUseCaseArgs): UserDeleteUseCasePerformResponse {
        const deleteArgsValidationResult = this.validateArgsProps(deleteArgs)

        const deleteArgsDTO = deleteArgsValidationResult.getValue()

        const performDeleteUserRepositoryResult = await this.performDeleteUserRepository(deleteArgsDTO)

        if (!performDeleteUserRepositoryResult.isSuccess()) {
            return Result.failure(performDeleteUserRepositoryResult.getError(), performDeleteUserRepositoryResult.getStatus())
        }

        return performDeleteUserRepositoryResult
    }

    private validateArgsProps(deleteArgs: UserDeleteUseCaseArgs) {
        const userListDTO = ZodValidateService.performParse(deleteArgs, UserDeleteUseCaseArgsSchema)

        return userListDTO
    }

    private async performDeleteUserRepository(deleteArgs: UserDeleteUseCaseResponse) {
        const response = await this.deleteUserRepository.perform({ where: { id: deleteArgs.id } })

        return response
    }
}
