import { ENUM_AUTH_MESSAGES } from '@util/messages/auth.messages'
import { UserPropSelect } from '@modules/user/repository/repository'
import { ZodValidateService } from '@services/zod'
import { Injectable } from '@nestjs/common'
import { HashEsliph, HttpEsliph, Result } from '@esliph/util-node'
import { z } from 'zod'
import { IsNotEmpty } from 'class-validator'
import { JwtService } from '@nestjs/jwt'
import { AuthenticationJWT } from '@@types/auth'
import { UserFindUniqueRepositoryAbstract } from '@modules/user/repository/find.repository'
import { ResultException } from '@util/exceptions/result.exception'
import { UserUpdateRepositoryAbstract } from '@modules/user/repository/update.repository'

export class AuthSignInUseCaseDTO {
    @IsNotEmpty({ message: ENUM_AUTH_MESSAGES.LOGIN_IS_EMPTY })
    login: string
    @IsNotEmpty({ message: ENUM_AUTH_MESSAGES.PASSWORD_IS_EMPTY })
    password: string
}

export const AuthSignInUseCaseArgsSchema = z.object({
    login: z.string().trim().nonempty({ message: ENUM_AUTH_MESSAGES.USERNAME_IS_EMPTY }),
    password: z.string().trim().nonempty({ message: ENUM_AUTH_MESSAGES.PASSWORD_IS_EMPTY })
})

const UserPropsSelected = {
    id: true,
    email: true,
    password: true,
    username: true,
    createAt: true,
    updateAt: true
}

type UserPropsSelectedType = { user: UserPropSelect<{ select: typeof UserPropsSelected }> }
export type AuthSignInUseCaseArgs = z.input<typeof AuthSignInUseCaseArgsSchema>
export type AuthSignInUseCaseResponse = z.output<typeof AuthSignInUseCaseArgsSchema>
export type AuthSignInUseCasePerformResponseValue = {
    token: string
}
export type AuthSignInUseCasePerformResponse = Promise<Result<AuthSignInUseCasePerformResponseValue>>

@Injectable()
export class AuthSignInUseCase {
    constructor(
        private readonly findUserUniqueRepository: UserFindUniqueRepositoryAbstract,
        private readonly jwtService: JwtService
    ) { }

    async perform(signInArgs: AuthSignInUseCaseArgs): AuthSignInUseCasePerformResponse {
        try {
            const responsePerform = await this.performSignIn(signInArgs)

            return responsePerform
        } catch (err: any) {
            if (err instanceof ResultException) {
                return err
            }
            return Result.failure({ title: 'User sign in', message: [{ message: 'Cannot sign in' }] }, HttpEsliph.HttpStatusCodes.BAD_REQUEST)
        }
    }

    private async performSignIn(signInArgs: AuthSignInUseCaseArgs): AuthSignInUseCasePerformResponse {
        const validateArgsPropsResponse = this.validateArgsProps(signInArgs)

        const signInData = validateArgsPropsResponse.getValue()

        const responseUser = await this.getUserByLogin(signInData.login)

        const { user } = responseUser.getValue()

        await this.validPassword(user.password, signInData.password)

        const token = await this.generateToken({
            sub: user.id,
            username: user.username, email: user.email
        })

        return Result.success({ token })
    }

    private validateArgsProps(createArgs: AuthSignInUseCaseArgs) {
        const authSignUpDTO = ZodValidateService.performParse(createArgs, AuthSignInUseCaseArgsSchema)

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

    private async generateToken(args: AuthenticationJWT) {
        const token = await this.jwtService.signAsync(args)

        return token
    }
}
