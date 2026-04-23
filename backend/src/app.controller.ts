import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  @ApiOperation({
    summary: 'Főoldal megjelenítése',
    description: 'Az alkalmazás főoldalát adja vissza HTML formában',
  })
  @ApiResponse({
    status: 200,
    description: 'Főoldal sikeresen megjelenítve',
  })
  getHello() {
    return { message: this.appService.getHello() };
  }
}
