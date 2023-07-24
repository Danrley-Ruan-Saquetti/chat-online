import { RequestAuthenticate } from '@@types/http'
import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { UserAuthenticate } from '@@types/auth'

export const CurrentUser = createParamDecorator(
    (data: unknown, context: ExecutionContext): UserAuthenticate => {
        const request = context.switchToHttp().getRequest<RequestAuthenticate>()

        return request.user
    },
)
