import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MunkaService } from './munka.service';
import { CreateMunkaDto } from './dto/create-munka.dto';
import { UpdateMunkaDto } from './dto/update-munka.dto';

@Controller('munka')
export class MunkaController {
  constructor(private readonly munkaService: MunkaService) {}

  @Post()
  create(@Body() createMunkaDto: CreateMunkaDto) {
    return this.munkaService.create(createMunkaDto);
  }

  @Get()
  findAll() {
    return this.munkaService.findAll();
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
}
