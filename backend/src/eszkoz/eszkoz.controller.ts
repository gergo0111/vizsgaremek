import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreateEszkozDto } from './dto/create-eszkoz.dto';
import { EszkozService } from './eszkoz.service';
import { UpdateEszkozDto } from './dto/update-eszkoz.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Eszközök')
@ApiBearerAuth('token')
@Controller('eszkozok')
export class EszkozController {
  constructor(private readonly eszkozService: EszkozService) {}

  @Post()
  @ApiOperation({
    summary: 'Új eszköz létrehozása',
    description: 'Egy új eszköz hozzáadása a rendszerbe',
  })
  @ApiResponse({
    status: 201,
    description: 'Az eszköz sikeresen létrehozva',
    schema: {
      example: {
        eszkoz_id: 1,
        nev: 'Laptop A1',
        tipus: 'Számítógép',
        darabszam: 5,
        hasznalatban: false,
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
  create(@Body() createEszkozDto: CreateEszkozDto) {
    return this.eszkozService.create(createEszkozDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Összes aktív eszköz lekérése',
    description: 'Az összes aktív eszköz listáját adja vissza',
  })
  @ApiResponse({
    status: 200,
    description: 'Eszközök sikeresen lekérve',
    schema: {
      example: [
        {
          eszkoz_id: 1,
          nev: 'Laptop A1',
          tipus: 'Számítógép',
          darabszam: 5,
          hasznalatban: false,
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
    return this.eszkozService.findAll();
  }

  @Get('deleted')
  @ApiOperation({
    summary: 'Összes törölt eszköz lekérése',
    description: 'Az összes inaktív (törölt) eszköz listáját adja vissza',
  })
  @ApiResponse({
    status: 200,
    description: 'Törölt eszközök sikeresen lekérve',
  })
  @ApiResponse({
    status: 401,
    description: 'Nincs bejelentkezve',
  })
  findDeleted() {
    return this.eszkozService.findDeleted();
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    description: 'Az eszköz azonosítója',
    example: 1,
    type: 'number',
  })
  @ApiOperation({
    summary: 'Eszköz lekérése azonosító alapján',
    description: 'Egy specifikus eszköz adatait adja vissza az ID alapján',
  })
  @ApiResponse({
    status: 200,
    description: 'Eszköz sikeresen lekérve',
    schema: {
      example: {
        eszkoz_id: 1,
        nev: 'Laptop A1',
        tipus: 'Számítógép',
        darabszam: 5,
        hasznalatban: false,
        isActive: true,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Az eszköz nem található',
  })
  @ApiResponse({
    status: 401,
    description: 'Nincs bejelentkezve',
  })
  findOne(@Param('id') id: string) {
    return this.eszkozService.findOne(+id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    description: 'Az eszköz azonosítója',
    example: 1,
    type: 'number',
  })
  @ApiOperation({
    summary: 'Eszköz módosítása',
    description: 'Egy eszköz adatainak módosítása',
  })
  @ApiResponse({
    status: 200,
    description: 'Eszköz sikeresen módosítva',
    schema: {
      example: {
        eszkoz_id: 1,
        nev: 'Laptop A1 - Updated',
        tipus: 'Számítógép',
        darabszam: 10,
        hasznalatban: true,
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
    description: 'Az eszköz nem található',
  })
  @ApiResponse({
    status: 401,
    description: 'Nincs bejelentkezve',
  })
  update(@Param('id') id: string, @Body() updateEszkozDto: UpdateEszkozDto) {
    return this.eszkozService.update(+id, updateEszkozDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    description: 'Az eszköz azonosítója',
    example: 1,
    type: 'number',
  })
  @ApiOperation({
    summary: 'Eszköz törlése (logikai törlés)',
    description: 'Egy eszköz inaktiválása (logikai törlés)',
  })
  @ApiResponse({
    status: 200,
    description: 'Eszköz sikeresen törölve',
    schema: {
      example: {
        eszkoz_id: 1,
        isActive: false,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Az eszköz nem található',
  })
  @ApiResponse({
    status: 401,
    description: 'Nincs bejelentkezve',
  })
  remove(@Param('id') id: string) {
    return this.eszkozService.delete(Number(id));
  }

  @Patch(':id/restore')
  @ApiParam({
    name: 'id',
    description: 'Az eszköz azonosítója',
    example: 1,
    type: 'number',
  })
  @ApiOperation({
    summary: 'Törölt eszköz visszaállítása',
    description: 'Egy inaktív eszköz aktiválása (visszaállítása)',
  })
  @ApiResponse({
    status: 200,
    description: 'Eszköz sikeresen visszaállítva',
    schema: {
      example: {
        eszkoz_id: 1,
        isActive: true,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Az eszköz nem található',
  })
  @ApiResponse({
    status: 401,
    description: 'Nincs bejelentkezve',
  })
  restore(@Param('id') id: string) {
    return this.eszkozService.restore(Number(id));
  }
}
