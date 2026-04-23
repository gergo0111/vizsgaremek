import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateEszkozDto {

       @ApiProperty({
              description: 'Az eszköz neve (egyedi)',
              example: 'Laptop A1',
              type: 'string',
       })
       @IsString()
       @IsNotEmpty()
       nev: string;

       @ApiProperty({
              description: 'Az eszköz típusa',
              example: 'Számítógép',
              type: 'string',
       })
       @IsString()
       @IsNotEmpty()
       tipus: string;

       @ApiProperty({
              description: 'Az eszközből rendelkezésre álló darabszám',
              example: 5,
              type: 'number',
              minimum: 0,
       })
       @IsNumber()
       @IsNotEmpty()
       darabszam: number;

       @ApiPropertyOptional({
              description: 'Az eszköz jelenleg használatban van-e',
              example: false,
              type: 'boolean',
              default: false,
       })
       @IsBoolean()
       @IsOptional()
       hasznalatban?: boolean;

}
