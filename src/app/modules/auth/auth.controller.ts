import { AppCore } from '@core'
import { Controller, Post } from '@nestjs/common'
import { Body, Req, Res } from '@nestjs/common/decorators'
import { Response } from '@@types/http'
import { AuthSignInUseCaseDTO } from '@modules/auth/use-case/sign-in.use-case'
import { AuthSignUpUseCaseDTO } from '@modules/auth/use-case/sign-up.use-case'
import { AuthService } from '@modules/auth/auth.service'
import { Privilege } from '@util/decorators/privilege.decorator'
import { GlobalPrivileges } from '@util/privileges'

@Controller('/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('/sign-up')
    async signUp(@Body() body: AuthSignUpUseCaseDTO, @Res() res: Response) {
        const response = await this.authService.signUp({ ...body })

        if (!response.isSuccess()) {
            AppCore.emit('error', {
                ...response.getError(),
                origin: 'AuthController:SignUp'
            })
        }

        return res.status(response.getStatus()).send(response.getResponse())
    }

    @Post('/sign-in')
    @Privilege(GlobalPrivileges.Public)
    async signIn(@Body() body: AuthSignInUseCaseDTO, @Res() res: Response) {
        const response = await this.authService.signIn({ ...body })

        if (!response.isSuccess()) {
            AppCore.emit('error', {
                ...response.getError(),
                origin: 'AuthController:SignIn'
            })
        }

        return res.status(response.getStatus()).send(response.getResponse())
    }
}
