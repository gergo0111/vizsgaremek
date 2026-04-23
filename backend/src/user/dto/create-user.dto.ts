import { IsBoolean, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, Matches, Min, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {

       @ApiProperty({
              description: 'Felhasználó felhasználóneve (egyedi)',
              example: 'nagy_janos',
              minLength: 3,
              type: 'string',
       })
       @IsString()
       @IsNotEmpty()
       felhasznalonev: string;

       @ApiProperty({
              description: 'Felhasználó email címe (egyedi, érvényes email formátum)',
              example: 'nagy.janos@example.com',
              type: 'string',
              format: 'email',
       })
       @IsString()
       @IsNotEmpty()
       @IsEmail()
       email: string;

       @ApiProperty({
              description: 'Felhasználó jelszava (min. 8 karakter, nagybetű, kisbetű, szám vagy speciális karakter)',
              example: 'SecurePass123!',
              minLength: 8,
              type: 'string',
              pattern: '((?=.*\\d)|(?=.*\\W+))(?![.\\n])(?=.*[A-Z])(?=.*[a-z]).*',
       })
       @IsString()
       @IsNotEmpty()
       @MinLength(8)
       @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {message: 'Túl gyenge jelszó! A jelszónak tartalmaznia kell legalább egy nagybetűt, egy kisbetűt és egy számot vagy speciális karaktert.'})
       jelszo: string;

       @ApiProperty({
              description: 'Felhasználó teljes neve',
              example: 'Nagy János',
              type: 'string',
       })
       @IsString()
       @IsNotEmpty()
       nev: string;

       @ApiProperty({
              description: 'Felhasználó munkaköre (beosztása)',
              example: 'Projektmenedzser',
              type: 'string',
       })
       @IsString()
       @IsNotEmpty()
       munkakor: string;

       @ApiProperty({
              description: 'Felhasználó heti munkaórái',
              example: 8,
              type: 'number',
              minimum: 0,
              maximum: 24,
       })
       @IsNumber()
       @IsNotEmpty()
       munkaora: number;

       @ApiPropertyOptional({
              description: 'Felhasználó aktív státusza',
              example: true,
              type: 'boolean',
              default: false,
       })
       @IsOptional()
       @IsBoolean()
       isActive?: boolean;

       @ApiPropertyOptional({
              description: 'Felhasználó admin jogosultsága',
              example: false,
              type: 'boolean',
              default: false,
       })
       @IsOptional()
       @IsBoolean()
       isAdmin?: boolean;

}
