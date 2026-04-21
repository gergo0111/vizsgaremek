import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreateEszkozDto } from './dto/create-eszkoz.dto';
import { EszkozService } from './eszkoz.service';
import { UpdateEszkozDto } from './dto/update-eszkoz.dto';


@Controller('eszkozok')
export class EszkozController {
  constructor(private readonly eszkozService: EszkozService) {}

  @Post()
  create(@Body() createEszkozDto: CreateEszkozDto) {
    return this.eszkozService.create(createEszkozDto);
  }

  @Get()
  findAll() {
    return this.eszkozService.findAll();
  }

  @Get('deleted')
  findDeleted() {
    return this.eszkozService.findDeleted();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eszkozService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEszkozDto: UpdateEszkozDto) {
    return this.eszkozService.update(+id, updateEszkozDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eszkozService.delete(Number(id));
  }

  @Patch(':id/restore')
  restore(@Param('id') id: string) {
    return this.eszkozService.restore(Number(id));
  }
}
