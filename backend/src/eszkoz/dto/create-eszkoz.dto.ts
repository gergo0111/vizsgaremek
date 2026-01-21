import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateEszkozDto {

       @IsString()
       @IsNotEmpty()
       nev: string;

       @IsString()
       @IsNotEmpty()
       tipus: string;

       @IsNumber()
       @IsNotEmpty()
       darabszam: number;

       @IsBoolean()
       @IsOptional()
       hasznalatban: boolean;

}
