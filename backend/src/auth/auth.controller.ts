import { Controller, Get, Post, Body, Patch, Param, Delete, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/login.dto';
import * as argon2 from 'argon2';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly userService: UserService) {}

  @Post('login')
  @ApiOperation({
    summary: 'Felhasználó bejelentkezése email-lel',
    description: 'Felhasználó bejelentkezése email cím és jelszó alapján. A szerver egy JWT tokent ad vissza.',
  })
  @ApiResponse({
    status: 200,
    description: 'Sikeres bejelentkezés',
    schema: {
      example: {
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJpYXQiOjE2MTYyMzkwMjJ9...',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Hibás email cím vagy jelszó',
    schema: {
      example: {
        statusCode: 401,
        message: 'Invalid credentials',
        error: 'Unauthorized',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Hibás bemenet',
  })
  async login(@Body() loginDto: LoginDto) {
    const user = await this.userService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    if (!await argon2.verify(user.password, loginDto.password)) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return {
      token: await this.userService.createToken(user.id),
    };
  }

  @Get()
  @ApiBearerAuth('token')
  @ApiOperation({
    summary: 'Összes token lekérése',
    description: 'Az összes aktív token listáját adja vissza',
  })
  @ApiResponse({
    status: 200,
    description: 'Tokenek sikeresen lekérve',
  })
  @ApiResponse({
    status: 401,
    description: 'Nincs bejelentkezve',
  })
  findAll() {
    return this.authService.findAll();
  }

  @Get(':id')
  @ApiBearerAuth('token')
  @ApiParam({
    name: 'id',
    description: 'A token azonosítója',
    example: 1,
    type: 'number',
  })
  @ApiOperation({
    summary: 'Token lekérése azonosító alapján',
    description: 'Egy specifikus token adatait adja vissza',
  })
  @ApiResponse({
    status: 200,
    description: 'Token sikeresen lekérve',
  })
  @ApiResponse({
    status: 404,
    description: 'A token nem található',
  })
  @ApiResponse({
    status: 401,
    description: 'Nincs bejelentkezve',
  })
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Patch(':id')
  @ApiBearerAuth('token')
  @ApiParam({
    name: 'id',
    description: 'A token azonosítója',
    example: 1,
    type: 'number',
  })
  @ApiOperation({
    summary: 'Token módosítása',
    description: 'Egy token adatainak módosítása',
  })
  @ApiResponse({
    status: 200,
    description: 'Token sikeresen módosítva',
  })
  @ApiResponse({
    status: 400,
    description: 'Hibás bemenet',
  })
  @ApiResponse({
    status: 404,
    description: 'A token nem található',
  })
  @ApiResponse({
    status: 401,
    description: 'Nincs bejelentkezve',
  })
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @Delete(':id')
  @ApiBearerAuth('token')
  @ApiParam({
    name: 'id',
    description: 'A token azonosítója',
    example: 1,
    type: 'number',
  })
  @ApiOperation({
    summary: 'Token törlése (kijelentkezés)',
    description: 'Egy token törlése, amely hatékonyan kijelentkezteti a felhasználót',
  })
  @ApiResponse({
    status: 200,
    description: 'Token sikeresen törölve',
  })
  @ApiResponse({
    status: 404,
    description: 'A token nem található',
  })
  @ApiResponse({
    status: 401,
    description: 'Nincs bejelentkezve',
  })
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
