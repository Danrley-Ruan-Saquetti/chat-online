import { Injectable } from '@nestjs/common'
import { HttpEsliph, Result } from '@esliph/util-node'
import { z } from 'zod'
import { ZodValidateService } from '@services/zod'
import { UserFindUniqueRepositoryAbstract } from '@modules/user/repository/find.repository'
import { UserPropSelect } from '../repository/repository'
import { ResultException } from '@util/exceptions/result.exception'

export class UserFindOneUseCaseDTO { }

export const UserFindOneUseCaseArgsSchema = ZodValidateService.defaultSchemaModelTable()

const UserPropsSelected = {
    id: true,
    email: true,
    username: true,
    createAt: true
}

export type UserFindOneUseCaseArgs = z.input<typeof UserFindOneUseCaseArgsSchema>
export type UserFindOneUseCaseResponse = z.output<typeof UserFindOneUseCaseArgsSchema>
export type UserFindOneUseCasePerformResponseValue = { user: UserPropSelect<{ select: typeof UserPropsSelected }> }
export type UserFindOneUseCasePerformResponse = Promise<Result<UserFindOneUseCasePerformResponseValue>>

@Injectable()
export class UserFindOneUseCase {
    constructor(private readonly findUserRepository: UserFindUniqueRepositoryAbstract) { }

    async perform(findArgs: UserFindOneUseCaseArgs): UserFindOneUseCasePerformResponse {
        try {
            const responsePerform = await this.performFindOne(findArgs)

            return responsePerform
        } catch (err: any) {
            if (err instanceof ResultException) {
                return err
            }
            return Result.failure({ title: 'Find User', message: [{ message: 'Cannot find user' }] }, HttpEsliph.HttpStatusCodes.BAD_REQUEST)
        }
    }

    private async performFindOne(findArgs: UserFindOneUseCaseArgs): UserFindOneUseCasePerformResponse {
        const findArgsValidationResult = this.validateArgsProps(findArgs)

        const findArgsDTO = findArgsValidationResult.getValue()

        const performFindRepositoryResult = await this.performFindRepository(findArgsDTO)

        if (!performFindRepositoryResult.isSuccess()) {
            return Result.failure(performFindRepositoryResult.getError(), performFindRepositoryResult.getStatus())
        }

        return Result.success<UserFindOneUseCasePerformResponseValue>(performFindRepositoryResult.getValue(), performFindRepositoryResult.getStatus())
    }

    private validateArgsProps(findArgs: UserFindOneUseCaseArgs) {
        const userFindDTO = ZodValidateService.performParse(findArgs, UserFindOneUseCaseArgsSchema)

        return userFindDTO
    }

    private async performFindRepository(findArgs: UserFindOneUseCaseResponse) {
        const response = await this.findUserRepository.perform({ where: { id: findArgs.id }, select: UserPropsSelected })

        return response
    }
}
