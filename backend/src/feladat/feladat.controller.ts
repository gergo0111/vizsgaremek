import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreateFeladatDto } from './dto/create-feladat.dto';
import { FeladatService } from './feladat.service';
import { UpdateFeladatDto } from './dto/update-feladat.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Feladatok')
@ApiBearerAuth('token')
@Controller('feladatok')
export class FeladatController {
  constructor(private readonly feladatService: FeladatService) {}

  @Post()
  @ApiOperation({
    summary: 'Új feladat létrehozása',
    description: 'Egy új feladat hozzáadása egy munkához',
  })
  @ApiResponse({
    status: 201,
    description: 'A feladat sikeresen létrehozva',
    schema: {
      example: {
        feladat_id: 1,
        munka_id: 1,
        leiras: 'Interfész tervezés elkészítése',
        isCompleted: false,
        isActive: true,
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Hibás bemenet vagy validációs hiba',
  })
  @ApiResponse({
    status: 401,
    description: 'Nincs bejelentkezve',
  })
  create(@Body() createFeladatDto: CreateFeladatDto) {
    return this.feladatService.create(createFeladatDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Összes aktív feladat lekérése',
    description: 'Az összes aktív feladat listáját adja vissza',
  })
  @ApiResponse({
    status: 200,
    description: 'Feladatok sikeresen lekérve',
    schema: {
      example: [
        {
          feladat_id: 1,
          munka_id: 1,
          leiras: 'Interfész tervezés elkészítése',
          isCompleted: false,
          isActive: true,
        },
      ],
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Nincs bejelentkezve',
  })
  findAll() {
    return this.feladatService.findAll();
  }

  @Get('deleted')
  @ApiOperation({
    summary: 'Összes törölt feladat lekérése',
    description: 'Az összes inaktív (törölt) feladat listáját adja vissza',
  })
  @ApiResponse({
    status: 200,
    description: 'Törölt feladatok sikeresen lekérve',
  })
  @ApiResponse({
    status: 401,
    description: 'Nincs bejelentkezve',
  })
  findDeleted() {
    return this.feladatService.findDeleted();
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    description: 'A feladat azonosítója',
    example: 1,
    type: 'number',
  })
  @ApiOperation({
    summary: 'Feladat lekérése azonosító alapján',
    description: 'Egy specifikus feladat adatait adja vissza az ID alapján',
  })
  @ApiResponse({
    status: 200,
    description: 'Feladat sikeresen lekérve',
    schema: {
      example: {
        feladat_id: 1,
        munka_id: 1,
        leiras: 'Interfész tervezés elkészítése',
        isCompleted: false,
        isActive: true,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'A feladat nem található',
  })
  @ApiResponse({
    status: 401,
    description: 'Nincs bejelentkezve',
  })
  findOne(@Param('id') id: string) {
    return this.feladatService.findOne(+id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    description: 'A feladat azonosítója',
    example: 1,
    type: 'number',
  })
  @ApiOperation({
    summary: 'Feladat módosítása',
    description: 'Egy feladat adatainak módosítása',
  })
  @ApiResponse({
    status: 200,
    description: 'Feladat sikeresen módosítva',
    schema: {
      example: {
        feladat_id: 1,
        munka_id: 1,
        leiras: 'Interfész tervezés elkészítése - frissítve',
        isCompleted: true,
        isActive: true,
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Hibás bemenet',
  })
  @ApiResponse({
    status: 404,
    description: 'A feladat nem található',
  })
  @ApiResponse({
    status: 401,
    description: 'Nincs bejelentkezve',
  })
  update(@Param('id') id: string, @Body() updateFeladatDto: UpdateFeladatDto) {
    return this.feladatService.update(+id, updateFeladatDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    description: 'A feladat azonosítója',
    example: 1,
    type: 'number',
  })
  @ApiOperation({
    summary: 'Feladat törlése (logikai törlés)',
    description: 'Egy feladat inaktiválása (logikai törlés)',
  })
  @ApiResponse({
    status: 200,
    description: 'Feladat sikeresen törölve',
    schema: {
      example: {
        feladat_id: 1,
        isActive: false,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'A feladat nem található',
  })
  @ApiResponse({
    status: 401,
    description: 'Nincs bejelentkezve',
  })
  remove(@Param('id') id: string) {
    return this.feladatService.delete(Number(id));
  }

  @Patch(':id/restore')
  @ApiParam({
    name: 'id',
    description: 'A feladat azonosítója',
    example: 1,
    type: 'number',
  })
  @ApiOperation({
    summary: 'Törölt feladat visszaállítása',
    description: 'Egy inaktív feladat aktiválása (visszaállítása)',
  })
  @ApiResponse({
    status: 200,
    description: 'Feladat sikeresen visszaállítva',
    schema: {
      example: {
        feladat_id: 1,
        isActive: true,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'A feladat nem található',
  })
  @ApiResponse({
    status: 401,
    description: 'Nincs bejelentkezve',
  })
  restore(@Param('id') id: string) {
    return this.feladatService.restore(Number(id));
  }
}
