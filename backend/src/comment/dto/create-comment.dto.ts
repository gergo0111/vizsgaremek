import { IsDate, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateCommentDto {

    @IsString()
    @IsNotEmpty()
    uzenet: string;

    @IsNotEmpty()
    @IsDate()
    kuldesi_ido: Date;

    @IsNotEmpty()
    @IsNumber()
    delete: number;

    @IsNotEmpty()
    @IsNumber()
    isActive: number;

}
