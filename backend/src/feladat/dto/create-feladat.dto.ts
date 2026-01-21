import { IsBoolean, IsNumber, IsString } from "class-validator";

export class CreateFeladatDto {

       @IsNumber()
       munka_id: number;

       @IsString()
       leiras: string;

       @IsBoolean()
       isCompleted: boolean;

       @IsBoolean()
       isActive: boolean;
}
