import { IsBoolean, IsNumber, IsString } from "class-validator";

export class CreateEszkozDto {

       @IsString()
       nev: string;

       @IsString()
       tipus: string;

       @IsNumber()
       darabszam: number;

       @IsBoolean()
       hasznalatban: boolean;

}
