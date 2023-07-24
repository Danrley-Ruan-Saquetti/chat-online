import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { AuthenticationJWT } from '@@types/auth'
import { AUTH_SECRET } from '@config/secrets/auth'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: AUTH_SECRET,
        })
    }

    async validate(payload: AuthenticationJWT) {
        return {
            id: payload.sub,
            email: payload.email,
            username: payload.username,
        }
    }
}
