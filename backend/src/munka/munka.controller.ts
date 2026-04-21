import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import type { Request } from 'express';
import { MunkaService } from './munka.service';
import { UpdateMunkaDto } from './dto/update-munka.dto';

@Controller('munka')
export class MunkaController {
  constructor(private readonly munkaService: MunkaService) {}

  @Post()
  create(@Body() body: any) {
    return this.munkaService.create(body);
  }

  @Get()
  findAll(@Req() req: Request) {
    const user = (req as any).user;
    const isAdmin = user?.isAdmin === true;
    const userId = user?.user_id ?? user?.id;
    return this.munkaService.findAll(isAdmin, userId);
  }

  @Get('deleted')
  findDeleted(@Req() req: Request) {
    const user = (req as any).user;
    const isAdmin = user?.isAdmin === true;
    const userId = user?.user_id ?? user?.id;
    return this.munkaService.findDeleted(isAdmin, userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.munkaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMunkaDto: UpdateMunkaDto) {
    return this.munkaService.update(+id, updateMunkaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.munkaService.delete(+id);
  }

  @Patch(':id/restore')
  restore(@Param('id') id: string) {
    return this.munkaService.restore(+id);
  }
}
