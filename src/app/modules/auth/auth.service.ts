import { Injectable } from '@nestjs/common'
import { HttpEsliph, Result } from '@esliph/util-node'
import { AuthSignInUseCase, AuthSignInUseCaseArgs } from '@modules/auth/use-case/sign-in.use-case'
import { AuthSignUpUseCase, AuthSignUpUseCaseArgs } from '@modules/auth/use-case/sign-up.use-case'
import { AuthValidCredentialsUseCase } from '@modules/auth/use-case/valid-credentials'
import { AuthValidatePrivilegeUseCase, AuthValidatePrivilegeUseCaseArgs } from '@modules/auth/use-case/validate-privilege.use-case'

@Injectable()
export class AuthService {
    constructor(
        private readonly signUpUC: AuthSignUpUseCase,
        private readonly signInUC: AuthSignInUseCase,
        private readonly validatePrivilegeUC: AuthValidatePrivilegeUseCase,
        private readonly validCredentials: AuthValidCredentialsUseCase
    ) { }

    async signUp(body: AuthSignUpUseCaseArgs) {
        try {
            const response = await this.signUpUC.perform({ ...body })

            return response
        } catch (err) {
            return Result.failure(
                { title: 'Auth Sign Up', message: [{ message: 'Cannot sign up', origin: 'ServerAPI' }] },
                HttpEsliph.HttpStatusCodes.INTERNAL_SERVER_ERROR
            )
        }
    }

    async signIn(body: AuthSignInUseCaseArgs) {
        try {
            const response = await this.signInUC.perform({ ...body })

            return response
        } catch (err) {
            return Result.failure(
                { title: 'Auth Sign In', message: [{ message: 'Cannot sign in', origin: 'ServerAPI' }] },
                HttpEsliph.HttpStatusCodes.INTERNAL_SERVER_ERROR
            )
        }
    }

    async validAuthentication(login: string, password: string) {
        const response = await this.validCredentials.perform({ login, password })

        if (!response.isSuccess()) {
            throw response.getError()
        }

        return response.getValue()
    }

    async validatePrivilege(body: AuthValidatePrivilegeUseCaseArgs) {
        try {
            const response = await this.validatePrivilegeUC.perform({ ...body })

            return response
        } catch (err) {
            return Result.failure(
                { title: 'Validate Privileges', message: [{ message: 'Cannot validate user privileges', origin: 'ServerAPI' }] },
                HttpEsliph.HttpStatusCodes.INTERNAL_SERVER_ERROR
            )
        }
    }
}
