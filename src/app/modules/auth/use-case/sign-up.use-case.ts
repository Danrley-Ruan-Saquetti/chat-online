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

export class AuthSignUpUseCaseDTO {
    @IsNotEmpty({ message: ENUM_AUTH_MESSAGES.USERNAME_IS_EMPTY })
    username: string
    @IsNotEmpty({ message: ENUM_AUTH_MESSAGES.EMAIL_IS_EMPTY })
    email: string
    @IsNotEmpty({ message: ENUM_AUTH_MESSAGES.PASSWORD_IS_EMPTY })
    password: string
}

export const AuthSignUpUseCaseArgsSchema = z.object({
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

export type AuthSignUpUseCaseArgs = z.input<typeof AuthSignUpUseCaseArgsSchema>
export type AuthSignUpUseCaseResponse = z.output<typeof AuthSignUpUseCaseArgsSchema>
export type AuthSignUpUseCasePerformResponseValue = { success: string }
export type AuthSignUpUseCasePerformResponse = Promise<Result<AuthSignUpUseCasePerformResponseValue>>

@Injectable()
export class AuthSignUpUseCase {
    constructor(private readonly createUserRepository: UserCreateRepositoryAbstract) { }

    async perform(createArgs: AuthSignUpUseCaseArgs): AuthSignUpUseCasePerformResponse {
        try {
            const responsePerform = await this.performSignUp(createArgs)

            return responsePerform
        } catch (err: any) {
            if (err instanceof ResultException) {
                return err
            }
            return Result.failure({ title: 'Auth Sign Up', message: [{ message: 'Cannot sign up' }] }, HttpEsliph.HttpStatusCodes.BAD_REQUEST)
        }
    }

    private async performSignUp(createArgs: AuthSignUpUseCaseArgs): AuthSignUpUseCasePerformResponse {
        const createArgsValidationResult = this.validateArgsProps(createArgs)

        const { email, password, username } = createArgsValidationResult.getValue()

        const userEntityTable = new UserEntitySimple({ email, password, username })

        await userEntityTable.cryptPassword()

        const performCreateUserRepositoryResult = await this.performCreateUserRepository(userEntityTable)

        if (!performCreateUserRepositoryResult.isSuccess()) {
            return Result.failure<AuthSignUpUseCasePerformResponseValue>(performCreateUserRepositoryResult.getError(), performCreateUserRepositoryResult.getStatus())
        }

        return Result.success<AuthSignUpUseCasePerformResponseValue>({ success: 'User sign up successfully' }, HttpEsliph.HttpStatusCodes.CREATED)
    }

    private validateArgsProps(createArgs: AuthSignUpUseCaseArgs) {
        const authSignUpDTO = ZodValidateService.performParse(createArgs, AuthSignUpUseCaseArgsSchema)

        return authSignUpDTO
    }

    private async performCreateUserRepository(userData: UserEntitySimple) {
        const response = await this.createUserRepository.perform({ data: userData })

        return response
    }
}
