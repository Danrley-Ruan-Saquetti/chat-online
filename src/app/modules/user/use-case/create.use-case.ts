import { Injectable } from '@nestjs/common'
import { HttpEsliph, Result } from '@esliph/util-node'
import { z } from 'zod'
import { ZodValidateService } from '@services/zod'
import { UserEntitySimple } from '@modules/user/schema'
import { IsNotEmpty } from 'class-validator'
import { UserCreateRepositoryAbstract } from '@modules/user/repository/create.repository'
import { ENUM_AUTH_MESSAGES } from '@util/messages/auth.messages'
import { USER_REGEX } from '@util/regex'
import { ResultException } from '@util/exceptions/result.exception'

export class UserCreateUseCaseDTO {
    @IsNotEmpty({ message: ENUM_AUTH_MESSAGES.USERNAME_IS_EMPTY })
    username: string
    @IsNotEmpty({ message: ENUM_AUTH_MESSAGES.EMAIL_IS_EMPTY })
    email: string
    @IsNotEmpty({ message: ENUM_AUTH_MESSAGES.PASSWORD_IS_EMPTY })
    password: string
}

export const UserCreateUseCaseArgsSchema = z.object({
    username: z
        .string()
        .trim()
        .nonempty({ message: ENUM_AUTH_MESSAGES.USERNAME_IS_EMPTY })
        .regex(USER_REGEX.USERNAME_REGEX, { message: ENUM_AUTH_MESSAGES.FORMAT_USERNAME_INVALID }),
    email: z.string().email({ message: ENUM_AUTH_MESSAGES.FORMAT_EMAIL_INVALID }).trim().nonempty({ message: ENUM_AUTH_MESSAGES.EMAIL_IS_EMPTY }),
    password: z
        .string()
        .trim()
        .nonempty({ message: ENUM_AUTH_MESSAGES.PASSWORD_IS_EMPTY })
        .regex(USER_REGEX.PASSWORD_REGEX, { message: ENUM_AUTH_MESSAGES.FORMAT_PASSWORD_INVALID })
})

export type UserCreateUseCaseArgs = z.input<typeof UserCreateUseCaseArgsSchema>
export type UserCreateUseCaseResponse = z.output<typeof UserCreateUseCaseArgsSchema>
export type UserCreateUseCasePerformResponseValue = { success: string }
export type UserCreateUseCasePerformResponse = Promise<Result<UserCreateUseCasePerformResponseValue>>

@Injectable()
export class UserCreateUseCase {
    constructor(private readonly createUserRepository: UserCreateRepositoryAbstract) { }

    async perform(createArgs: UserCreateUseCaseArgs): UserCreateUseCasePerformResponse {
        try {
            const responsePerform = await this.performCreate(createArgs)

            return responsePerform
        } catch (err: any) {
            if (err instanceof ResultException) {
                return err
            }

            return Result.failure({ title: 'Create User', message: [{ message: 'Cannot create user' }] }, HttpEsliph.HttpStatusCodes.BAD_REQUEST)
        }
    }

    private async performCreate(createArgs: UserCreateUseCaseArgs): UserCreateUseCasePerformResponse {
        const createArgsValidationResult = this.validateArgsProps(createArgs)

        const { email, password, username } = createArgsValidationResult.getValue()

        const userEntityTable = new UserEntitySimple({ email, password, username })

        await userEntityTable.cryptPassword()

        const performCreateUserRepositoryResult = await this.performCreateUserRepository(userEntityTable)

        if (!performCreateUserRepositoryResult.isSuccess()) {
            return Result.failure(performCreateUserRepositoryResult.getError(), performCreateUserRepositoryResult.getStatus())
        }

        return Result.success({ success: 'User create successfully' }, HttpEsliph.HttpStatusCodes.CREATED)
    }

    private validateArgsProps(createArgs: UserCreateUseCaseArgs) {
        const UserCreateDTO = ZodValidateService.performParse(createArgs, UserCreateUseCaseArgsSchema)

        return UserCreateDTO
    }

    private async performCreateUserRepository(userData: UserEntitySimple) {
        const response = await this.createUserRepository.perform({ data: userData })

        return response
    }
}
