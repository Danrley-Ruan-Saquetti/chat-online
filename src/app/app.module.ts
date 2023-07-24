import { MiddlewareConsumer, Module, NestModule, Provider, ValidationPipe } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'
import { APP_PIPE, APP_INTERCEPTOR, APP_GUARD } from '@nestjs/core'
import { GlobalInterceptor } from '@util/interceptor'
import { AppController } from '@app.controller'
import { AppService } from '@app.service'
import { GlobalMiddleware } from '@util/middleware'
import { AuthModule } from '@modules/auth/auth.module'
import { UserModule } from '@modules/user/user.modules'
import { AuthenticationGuard } from '@modules/auth/guards/authentication.guard'

const AppModuleServices: Provider[] = []

const AppModuleDependencies: Provider[] = [
    {
        provide: APP_PIPE,
        useClass: ValidationPipe
    },
    {
        provide: APP_INTERCEPTOR,
        useClass: GlobalInterceptor
    },
    {
        provide: APP_GUARD,
        useClass: AuthenticationGuard
    }
]

@Module({
    imports: [
        ScheduleModule.forRoot(),
        UserModule,
        AuthModule
    ],
    controllers: [
        AppController
    ],
    providers: [
        AppService,
        ...AppModuleDependencies,
        ...AppModuleServices,
    ],
    exports: [...AppModuleServices]
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(GlobalMiddleware).forRoutes('*')
    }
}
