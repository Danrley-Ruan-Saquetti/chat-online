import { JwtModule, JwtModuleOptions } from '@nestjs/jwt'
import { AUTH_SECRET } from '@config/secrets/auth'

export const CONFIG_JWT_MODULE: JwtModuleOptions = {
    global: true,
    secret: AUTH_SECRET,
    signOptions: { expiresIn: '1d' }
}

export const CONFIG_JWT_MODULE_ROOT = JwtModule.register(CONFIG_JWT_MODULE)
