import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateFeladatDto {

       @ApiProperty({
              description: 'A munka azonosítója, amelyhez a feladat tartozik',
              example: 1,
              type: 'number',
       })
       @IsNumber()
       @IsNotEmpty()
       munka_id: number;

       @ApiProperty({
              description: 'A feladat leírása',
              example: 'Interfész tervezés elkészítése',
              type: 'string',
       })
       @IsString()
       @IsNotEmpty()
       leiras: string;

       @ApiPropertyOptional({
              description: 'A feladat teljesítésének státusza',
              example: false,
              type: 'boolean',
              default: false,
       })
       @IsBoolean()
       @IsOptional()
       isCompleted?: boolean;

       @ApiPropertyOptional({
              description: 'A feladat aktív státusza',
              example: true,
              type: 'boolean',
              default: true,
       })
       @IsBoolean()
       @IsOptional()
       isActive?: boolean;
}
