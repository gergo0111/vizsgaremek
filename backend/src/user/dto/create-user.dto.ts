import { IsBoolean, IsEmail, IsNotEmpty, IsNumber, IsString, Matches, Min, MinLength } from 'class-validator';

export class CreateUserDto {

       @IsString()
       @IsNotEmpty()
       felhasznalonev: string;

       @IsString()
       @IsNotEmpty()
       @IsEmail()
       email: string;

       @IsString()
       @IsNotEmpty()
       @MinLength(8)
       @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {message: 'Túl gyenge jelszó'})
       jelszo: string;

       @IsString()
       @IsNotEmpty()
       nev: string;

       @IsString()
       @IsNotEmpty()
       munkakor: string;

       @IsNumber()
       @IsNotEmpty()
       @Min(2)
       munkaora: number;

       @IsNotEmpty()
       @IsBoolean()
       isActive: boolean;

       @IsNotEmpty()
       @IsBoolean()
       isAdmin: boolean;

}
