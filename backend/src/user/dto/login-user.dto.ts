import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({
    description: 'Felhasználó felhasználóneve',
    example: 'nagy_janos',
    type: 'string',
  })
  @IsString()
  @IsNotEmpty()
  felhasznalonev: string;

  @ApiProperty({
    description: 'Felhasználó jelszava',
    example: 'SecurePass123!',
    type: 'string',
  })
  @IsString()
  @IsNotEmpty()
  jelszo: string;
}