import { Module, Provider } from '@nestjs/common'
import { AuthDependencies } from '@modules/auth/auth.dependencies'
import { AuthUseCaseModule } from '@modules/auth/use-case.module'
import { AuthController } from '@modules/auth/auth.controller'
import { AuthService } from '@modules/auth/auth.service'
import { JwtStrategy } from '@modules/auth/strategies/jwt-auth.strategy'

const authModuleServices: Provider[] = [AuthService]

@Module({
    imports: [AuthUseCaseModule],
    controllers: [AuthController],
    providers: [
        JwtStrategy,
        ...AuthDependencies,
        ...authModuleServices
    ],
    exports: [
        ...AuthDependencies,
        ...authModuleServices
    ]
})
export class AuthModule { }
