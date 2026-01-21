import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateFeladatDto {

       @IsNumber()
       @IsNotEmpty()
       munka_id: number;

       @IsString()
       @IsNotEmpty()
       leiras: string;

       @IsBoolean()
       @IsOptional()
       isCompleted: boolean;

       @IsBoolean()
       @IsOptional()
       isActive: boolean;
}
