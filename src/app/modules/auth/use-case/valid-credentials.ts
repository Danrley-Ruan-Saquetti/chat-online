import { ENUM_AUTH_MESSAGES } from '@util/messages/auth.messages'
import { UserPropSelect } from '@modules/user/repository/repository'
import { ZodValidateService } from '@services/zod'
import { Injectable } from '@nestjs/common'
import { HashEsliph, HttpEsliph, Result } from '@esliph/util-node'
import { z } from 'zod'
import { UserFindUniqueRepositoryAbstract } from '@modules/user/repository/find.repository'
import { ResultException } from '@util/exceptions/result.exception'

export const AuthValidCredentialsUseCaseArgsSchema = z.object({
    login: z.string().trim().nonempty({ message: ENUM_AUTH_MESSAGES.USERNAME_IS_EMPTY }),
    password: z.string().trim().nonempty({ message: ENUM_AUTH_MESSAGES.PASSWORD_IS_EMPTY })
})

const UserPropsSelected = {
    id: true,
    email: true,
    password: true,
    username: true,
}

type UserPropsSelectedType = { user: UserPropSelect<{ select: typeof UserPropsSelected }> }
export type AuthValidCredentialsUseCaseArgs = z.input<typeof AuthValidCredentialsUseCaseArgsSchema>
export type AuthValidCredentialsUseCaseResponse = z.output<typeof AuthValidCredentialsUseCaseArgsSchema>
export type AuthValidCredentialsUseCasePerformResponseValue = {
    id: number,
    email: string,
    username: string
}
export type AuthValidCredentialsUseCasePerformResponse = Promise<Result<AuthValidCredentialsUseCasePerformResponseValue>>

@Injectable()
export class AuthValidCredentialsUseCase {
    constructor(
        private readonly findUserUniqueRepository: UserFindUniqueRepositoryAbstract,
    ) { }

    async perform(validCredentialsArgs: AuthValidCredentialsUseCaseArgs): AuthValidCredentialsUseCasePerformResponse {
        try {
            const responsePerform = await this.performValidCredentials(validCredentialsArgs)

            return responsePerform
        } catch (err: any) {
            if (err instanceof ResultException) { return err }

            return Result.failure({ title: 'Validate Credentials', message: [{ message: 'Invalid credentials' }] }, HttpEsliph.HttpStatusCodes.BAD_REQUEST)
        }
    }

    private async performValidCredentials(validCredentialsArgs: AuthValidCredentialsUseCaseArgs): AuthValidCredentialsUseCasePerformResponse {
        const validateArgsPropsResponse = this.validateArgsProps(validCredentialsArgs)

        const validCredentialsData = validateArgsPropsResponse.getValue()

        const responseUser = await this.getUserByLogin(validCredentialsData.login)

        const { user } = responseUser.getValue()

        await this.validPassword(user.password, validCredentialsData.password)

        return Result.success({
            id: user.id,
            email: user.email,
            username: user.username,
        })
    }

    private validateArgsProps(createArgs: AuthValidCredentialsUseCaseArgs) {
        const authSignUpDTO = ZodValidateService.performParse(createArgs, AuthValidCredentialsUseCaseArgsSchema)

        return authSignUpDTO
    }

    private async getUserByLogin(login: string) {
        const responseFindUserByEmail = await this.findUserByEmail(login)

        if (responseFindUserByEmail.isSuccess()) {
            return responseFindUserByEmail
        }

        const responseFindUserByUsername = await this.findUserByUsername(login)

        if (responseFindUserByUsername.isSuccess()) {
            return responseFindUserByUsername
        }

        throw new ResultException<UserPropsSelectedType>(
            {
                title: 'Sign In user',
                message: [{ message: '"Login" or "Password" incorrect', origin: 'login;password' }]
            },
            HttpEsliph.HttpStatusCodes.BAD_REQUEST
        )
    }

    private async findUserByEmail(email: string) {
        const responseUserByEmail = await this.performFindUserRepository({ email })

        return responseUserByEmail
    }

    private async findUserByUsername(username: string) {
        const responseUserByEmail = await this.performFindUserRepository({ username })

        return responseUserByEmail
    }

    private async performFindUserRepository(args: { username: string } | { email: string }) {
        const responseUserByEmail: Result<UserPropsSelectedType> = await this.findUserUniqueRepository.perform({
            where: { ...args },
            select: UserPropsSelected
        })

        return responseUserByEmail
    }

    private async validPassword(passwordHashed: string, passwordArg: string) {
        const validPassword = await HashEsliph.compareHashWithRef(passwordHashed, passwordArg)

        if (!validPassword) {
            throw new ResultException<UserPropsSelectedType>(
                {
                    title: 'Sign In user',
                    message: [{ message: '"Login" or "Password" incorrect', origin: 'login;password' }]
                },
                HttpEsliph.HttpStatusCodes.BAD_REQUEST
            )
        }

        return validPassword
    }
}
