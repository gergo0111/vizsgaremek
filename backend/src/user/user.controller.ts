import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { Patch as PatchDecorator } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({
    summary: 'Új felhasználó létrehozása',
    description: 'Egy új felhasználó regisztrálása a rendszerbe',
  })
  @ApiResponse({
    status: 201,
    description: 'A felhasználó sikeresen létrehozva',
    schema: {
      example: {
        user_id: 1,
        felhasznalonev: 'nagy_janos',
        email: 'nagy.janos@example.com',
        nev: 'Nagy János',
        munkakor: 'Projektmenedzser',
        munkaora: 8,
        isActive: false,
        isAdmin: false,
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Hibás bemenet vagy validációs hiba',
    schema: {
      example: {
        statusCode: 400,
        message: ['Túl gyenge jelszó!'],
        error: 'Bad Request',
      },
    },
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('login')
  @ApiOperation({
    summary: 'Felhasználó bejelentkezése',
    description: 'A felhasználó bejelentkezik felhasználónév és jelszó alapján',
  })
  @ApiResponse({
    status: 200,
    description: 'Sikeres bejelentkezés',
    schema: {
      example: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        user: {
          user_id: 1,
          felhasznalonev: 'nagy_janos',
          email: 'nagy.janos@example.com',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Hibás felhasználónév vagy jelszó',
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
      },
    },
  })
  login(@Body() loginUserDto: LoginUserDto) {
    return this.userService.login(loginUserDto);
  }

  @Get()
  @ApiBearerAuth('token')
  @ApiOperation({
    summary: 'Összes aktív felhasználó lekérése',
    description: 'Az összes aktív felhasználó listáját adja vissza',
  })
  @ApiResponse({
    status: 200,
    description: 'Felhasználók sikeresen lekérve',
    schema: {
      example: [
        {
          user_id: 1,
          felhasznalonev: 'nagy_janos',
          email: 'nagy.janos@example.com',
          nev: 'Nagy János',
          munkakor: 'Projektmenedzser',
          munkaora: 8,
          isActive: true,
          isAdmin: false,
        },
      ],
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Nincs bejelentkezve',
  })
  findAll() {
    return this.userService.findAll();
  }

  @Get('deleted')
  @ApiBearerAuth('token')
  @ApiOperation({
    summary: 'Összes törölt felhasználó lekérése',
    description: 'Az összes inaktív (törölt) felhasználó listáját adja vissza',
  })
  @ApiResponse({
    status: 200,
    description: 'Törölt felhasználók sikeresen lekérve',
  })
  @ApiResponse({
    status: 401,
    description: 'Nincs bejelentkezve',
  })
  findDeleted() {
    return this.userService.findDeleted();
  }

  @Get(':id')
  @ApiBearerAuth('token')
  @ApiParam({
    name: 'id',
    description: 'A felhasználó azonosítója',
    example: 1,
    type: 'number',
  })
  @ApiOperation({
    summary: 'Felhasználó lekérése azonosító alapján',
    description: 'Egy specifikus felhasználó adatait adja vissza az ID alapján',
  })
  @ApiResponse({
    status: 200,
    description: 'Felhasználó sikeresen lekérve',
    schema: {
      example: {
        user_id: 1,
        felhasznalonev: 'nagy_janos',
        email: 'nagy.janos@example.com',
        nev: 'Nagy János',
        munkakor: 'Projektmenedzser',
        munkaora: 8,
        isActive: true,
        isAdmin: false,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'A felhasználó nem található',
    schema: {
      example: {
        statusCode: 404,
        message: 'Not Found',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Nincs bejelentkezve',
  })
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  @ApiBearerAuth('token')
  @ApiParam({
    name: 'id',
    description: 'A felhasználó azonosítója',
    example: 1,
    type: 'number',
  })
  @ApiOperation({
    summary: 'Felhasználó módosítása',
    description: 'Egy felhasználó adatainak módosítása',
  })
  @ApiResponse({
    status: 200,
    description: 'Felhasználó sikeresen módosítva',
    schema: {
      example: {
        user_id: 1,
        felhasznalonev: 'nagy_janos_updated',
        email: 'nagy.janos.updated@example.com',
        nev: 'Nagy János Updated',
        munkakor: 'Szénior Projektmenedzser',
        munkaora: 9,
        isActive: true,
        isAdmin: false,
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Hibás bemenet',
  })
  @ApiResponse({
    status: 404,
    description: 'A felhasználó nem található',
  })
  @ApiResponse({
    status: 401,
    description: 'Nincs bejelentkezve',
  })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @ApiBearerAuth('token')
  @ApiParam({
    name: 'id',
    description: 'A felhasználó azonosítója',
    example: 1,
    type: 'number',
  })
  @ApiOperation({
    summary: 'Felhasználó törlése (logikai törlés)',
    description: 'Egy felhasználó inaktiválása (logikai törlés)',
  })
  @ApiResponse({
    status: 200,
    description: 'Felhasználó sikeresen törölt',
    schema: {
      example: {
        user_id: 1,
        isActive: false,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'A felhasználó nem található',
  })
  @ApiResponse({
    status: 401,
    description: 'Nincs bejelentkezve',
  })
  remove(@Param('id') id: string) {
    return this.userService.delete(Number(id));
  }

  @Patch(':id/restore')
  @ApiBearerAuth('token')
  @ApiParam({
    name: 'id',
    description: 'A felhasználó azonosítója',
    example: 1,
    type: 'number',
  })
  @ApiOperation({
    summary: 'Törölt felhasználó visszaállítása',
    description: 'Egy inaktív felhasználó aktiválása (visszaállítása)',
  })
  @ApiResponse({
    status: 200,
    description: 'Felhasználó sikeresen visszaállítva',
    schema: {
      example: {
        user_id: 1,
        isActive: true,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'A felhasználó nem található',
  })
  @ApiResponse({
    status: 401,
    description: 'Nincs bejelentkezve',
  })
  restore(@Param('id') id: string) {
    return this.userService.restore(Number(id));
  }
}