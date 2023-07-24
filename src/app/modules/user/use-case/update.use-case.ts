import { Injectable } from '@nestjs/common'
import { HttpEsliph, Result } from '@esliph/util-node'
import { z } from 'zod'
import { ZodValidateService } from '@services/zod'
import { UserEntityTable } from '@modules/user/schema'
import { UserPropSelect } from '@modules/user/repository/repository'
import { UserUpdateRepositoryAbstract } from '../repository/update.repository'
import { UserFindUniqueRepositoryAbstract } from '../repository/find.repository'
import { IsOptional } from 'class-validator'
import { ResultException } from '@util/exceptions/result.exception'

export class UserUpdateUseCaseDTO {
    @IsOptional()
    username?: string
    @IsOptional()
    email?: string
}

export const UserUpdateUseCaseArgsSchema = ZodValidateService.defaultSchemaModelTable().extend({
    username: z.string().trim().optional(),
    name: z.string().trim().optional(),
    email: z.string().trim().optional()
})

export const EnumUserFindPropsSelect = {
    username: true,
    email: true,
    createAt: true
}
export type UserFindPropsSelect = UserPropSelect<{ select: typeof EnumUserFindPropsSelect }>
export type UserUpdateUseCaseArgs = z.input<typeof UserUpdateUseCaseArgsSchema>
export type UserUpdateUseCaseResponse = z.output<typeof UserUpdateUseCaseArgsSchema>
export type UserUpdateUseCasePerformResponseValue = { success: string }
export type UserUpdateUseCasePerformResponse = Promise<Result<UserUpdateUseCasePerformResponseValue>>

@Injectable()
export class UserUpdateUseCase {
    constructor(private readonly updateUserRepository: UserUpdateRepositoryAbstract, private readonly findUserRepository: UserFindUniqueRepositoryAbstract) { }

    async perform(updateArgs: UserUpdateUseCaseArgs): UserUpdateUseCasePerformResponse {
        try {
            const responsePerform = await this.performUpdate(updateArgs)

            return responsePerform
        } catch (err: any) {
            if (err instanceof ResultException) {
                return err
            }
            return Result.failure({ title: 'Update User', message: [{ message: 'Cannot update user' }] }, HttpEsliph.HttpStatusCodes.BAD_REQUEST)
        }
    }

    private async performUpdate(updateArgs: UserUpdateUseCaseArgs): UserUpdateUseCasePerformResponse {
        const updateArgsValidationResult = this.validateArgsProps(updateArgs)

        const updateUserData = updateArgsValidationResult.getValue()

        const findUserToBeUpdatedResult = await this.findUserToBeUpdated({ id: updateUserData.id })

        const userToBeUpdated = findUserToBeUpdatedResult.getValue().user

        const userEntityTable = new UserEntityTable(userToBeUpdated)

        userEntityTable.update(updateUserData)

        const performUpdateRepositoryResult = await this.performUpdateRepository(userEntityTable)

        if (!performUpdateRepositoryResult.isSuccess()) {
            return Result.failure(performUpdateRepositoryResult.getError(), performUpdateRepositoryResult.getStatus())
        }

        return Result.success({ success: 'User update successfully' }, HttpEsliph.HttpStatusCodes.OK)
    }

    private async findUserToBeUpdated(args: { id: number }) {
        const response = await this.findUserRepository.perform({ where: { id: args.id } })

        return response
    }

    private validateArgsProps(updateArgs: UserUpdateUseCaseArgs) {
        const userUpdateDTO = ZodValidateService.performParse(updateArgs, UserUpdateUseCaseArgsSchema)

        return userUpdateDTO
    }

    private async performUpdateRepository(userData: UserEntityTable) {
        const response = await this.updateUserRepository.perform({
            where: { id: userData.id },
            data: {
                username: userData.username,
                email: userData.email
            }
        })

        return response
    }
}
