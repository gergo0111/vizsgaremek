import { IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDto {
  @IsString()
  @IsNotEmpty()
  felhasznalonev: string;

  @IsString()
  @IsNotEmpty()
  jelszo: string;
}