import { Global, Module, Provider } from '@nestjs/common'
import { AuthSignInUseCase } from '@modules/auth/use-case/sign-in.use-case'
import { AuthSignUpUseCase } from '@modules/auth/use-case/sign-up.use-case'
import { AuthValidCredentialsUseCase } from '@modules/auth/use-case/valid-credentials'
import { AuthValidatePrivilegeUseCase } from '@modules/auth/use-case/validate-privilege.use-case'

const authServicesUseCase: Provider[] = [AuthValidatePrivilegeUseCase, AuthSignUpUseCase, AuthSignInUseCase, AuthValidCredentialsUseCase]

@Global()
@Module({
    providers: [...authServicesUseCase],
    exports: [...authServicesUseCase]
})
export class AuthUseCaseModule { }
