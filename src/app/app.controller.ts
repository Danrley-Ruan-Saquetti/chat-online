import { Controller, Get, Post, Delete, Put } from '@nestjs/common'
import { Body, Res, Param } from '@nestjs/common/decorators'
import { Response } from '@@types/http.d'
import { AppService } from '@app.service'

@Controller('/')
export class AppController {
    constructor(private readonly appService: AppService) { }

    @Get('/')
    home(@Res() res: Response) {
        const response = this.appService.home()

        return res.status(response.getStatus()).send(response.getResponse())
    }

    @Get('/ping')
    pingPong(@Res() res: Response) {
        const response = this.appService.pingPong()

        return res.status(response.getStatus()).send(response.getResponse())
    }
}
