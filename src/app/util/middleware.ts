import { Next, Request, Response } from '@@types/http'
import { Injectable, NestMiddleware } from '@nestjs/common'

@Injectable()
export class GlobalMiddleware implements NestMiddleware {
    use(req: Request['raw'], res: Response['raw'], next: Next) {
        return next()
    }
}
