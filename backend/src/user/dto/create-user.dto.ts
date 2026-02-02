import { IsBoolean, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, Matches, Min, MinLength } from 'class-validator';

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
       @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {message: 'Túl gyenge jelszó! A jelszónak tartalmaznia kell legalább egy nagybetűt, egy kisbetűt és egy számot vagy speciális karaktert.'})
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

       @IsOptional()
       @IsBoolean()
       isActive: boolean;

       @IsOptional()
       @IsBoolean()
       isAdmin: boolean;

}
