import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import type { Request } from 'express';
import { MunkaService } from './munka.service';
import { UpdateMunkaDto } from './dto/update-munka.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { CreateMunkaDto } from './dto/create-munka.dto';

@ApiTags('Munkák')
@ApiBearerAuth('token')
@Controller('munka')
export class MunkaController {
  constructor(private readonly munkaService: MunkaService) {}

  @Post()
  @ApiOperation({
    summary: 'Új munka létrehozása',
    description: 'Egy új munka hozzáadása a rendszerbe, opcionálisan eszközökkel és dolgozókkal',
  })
  @ApiResponse({
    status: 201,
    description: 'A munka sikeresen létrehozva',
    schema: {
      example: {
        munka_id: 1,
        munka_neve: 'API fejlesztés',
        leiras: 'RESTful API fejlesztés a projekt számára',
        ertesitesIsActive: false,
        isActive: true,
        kezdeti_datum: '2026-04-23T10:00:00Z',
        varhato_befejezes_datuma: '2026-05-23T17:00:00Z',
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
  create(@Body() body: CreateMunkaDto) {
    return this.munkaService.create(body);
  }

  @Get()
  @ApiOperation({
    summary: 'Felhasználóhoz tartozó munkák lekérése',
    description: 'Az aktuális felhasználóhoz tartozó vagy (admin esetén) összes munkát adja vissza',
  })
  @ApiResponse({
    status: 200,
    description: 'Munkák sikeresen lekérve',
    schema: {
      example: [
        {
          munka_id: 1,
          munka_neve: 'API fejlesztés',
          leiras: 'RESTful API fejlesztés a projekt számára',
          ertesitesIsActive: false,
          isActive: true,
          kezdeti_datum: '2026-04-23T10:00:00Z',
          varhato_befejezes_datuma: '2026-05-23T17:00:00Z',
        },
      ],
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Nincs bejelentkezve',
  })
  findAll(@Req() req: Request) {
    const user = (req as any).user;
    const isAdmin = user?.isAdmin === true;
    const userId = user?.user_id ?? user?.id;
    return this.munkaService.findAll(isAdmin, userId);
  }

  @Get('deleted')
  @ApiOperation({
    summary: 'Törölt munkák lekérése',
    description: 'Az aktuális felhasználóhoz tartozó vagy (admin esetén) összes törölt munkát adja vissza',
  })
  @ApiResponse({
    status: 200,
    description: 'Törölt munkák sikeresen lekérve',
  })
  @ApiResponse({
    status: 401,
    description: 'Nincs bejelentkezve',
  })
  findDeleted(@Req() req: Request) {
    const user = (req as any).user;
    const isAdmin = user?.isAdmin === true;
    const userId = user?.user_id ?? user?.id;
    return this.munkaService.findDeleted(isAdmin, userId);
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    description: 'A munka azonosítója',
    example: 1,
    type: 'number',
  })
  @ApiOperation({
    summary: 'Munka lekérése azonosító alapján',
    description: 'Egy specifikus munka adatait adja vissza az ID alapján',
  })
  @ApiResponse({
    status: 200,
    description: 'Munka sikeresen lekérve',
    schema: {
      example: {
        munka_id: 1,
        munka_neve: 'API fejlesztés',
        leiras: 'RESTful API fejlesztés a projekt számára',
        ertesitesIsActive: false,
        isActive: true,
        kezdeti_datum: '2026-04-23T10:00:00Z',
        varhato_befejezes_datuma: '2026-05-23T17:00:00Z',
        munkaUsers: [],
        munkaEszkozok: [],
        feladat: [],
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'A munka nem található',
  })
  @ApiResponse({
    status: 401,
    description: 'Nincs bejelentkezve',
  })
  findOne(@Param('id') id: string) {
    return this.munkaService.findOne(+id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    description: 'A munka azonosítója',
    example: 1,
    type: 'number',
  })
  @ApiOperation({
    summary: 'Munka módosítása',
    description: 'Egy munka adatainak módosítása',
  })
  @ApiResponse({
    status: 200,
    description: 'Munka sikeresen módosítva',
    schema: {
      example: {
        munka_id: 1,
        munka_neve: 'API fejlesztés - frissítve',
        leiras: 'RESTful API fejlesztés a projekt számára - módosított',
        ertesitesIsActive: true,
        isActive: true,
        kezdeti_datum: '2026-04-23T10:00:00Z',
        varhato_befejezes_datuma: '2026-06-23T17:00:00Z',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Hibás bemenet',
  })
  @ApiResponse({
    status: 404,
    description: 'A munka nem található',
  })
  @ApiResponse({
    status: 401,
    description: 'Nincs bejelentkezve',
  })
  update(@Param('id') id: string, @Body() updateMunkaDto: UpdateMunkaDto) {
    return this.munkaService.update(+id, updateMunkaDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    description: 'A munka azonosítója',
    example: 1,
    type: 'number',
  })
  @ApiOperation({
    summary: 'Munka törlése (logikai törlés)',
    description: 'Egy munka inaktiválása (logikai törlés)',
  })
  @ApiResponse({
    status: 200,
    description: 'Munka sikeresen törölve',
    schema: {
      example: {
        munka_id: 1,
        isActive: false,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'A munka nem található',
  })
  @ApiResponse({
    status: 401,
    description: 'Nincs bejelentkezve',
  })
  remove(@Param('id') id: string) {
    return this.munkaService.delete(+id);
  }

  @Patch(':id/restore')
  @ApiParam({
    name: 'id',
    description: 'A munka azonosítója',
    example: 1,
    type: 'number',
  })
  @ApiOperation({
    summary: 'Törölt munka visszaállítása',
    description: 'Egy inaktív munka aktiválása (visszaállítása)',
  })
  @ApiResponse({
    status: 200,
    description: 'Munka sikeresen visszaállítva',
    schema: {
      example: {
        munka_id: 1,
        isActive: true,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'A munka nem található',
  })
  @ApiResponse({
    status: 401,
    description: 'Nincs bejelentkezve',
  })
  restore(@Param('id') id: string) {
    return this.munkaService.restore(+id);
  }
}
