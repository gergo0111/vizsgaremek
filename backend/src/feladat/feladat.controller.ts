import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreateFeladatDto } from './dto/create-feladat.dto';
import { FeladatService } from './feladat.service';
import { UpdateFeladatDto } from './dto/update-feladat.dto';


@Controller('feladatok')
export class FeladatController {
  constructor(private readonly feladatService: FeladatService) {}

  @Post()
  create(@Body() createFeladatDto: CreateFeladatDto) {
    return this.feladatService.create(createFeladatDto);
  }

  @Get()
  findAll() {
    return this.feladatService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.feladatService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFeladatDto: UpdateFeladatDto) {
    return this.feladatService.update(+id, updateFeladatDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.feladatService.delete(Number(id));
  }
}
