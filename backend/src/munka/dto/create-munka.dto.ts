import { IsBoolean, IsDate, IsNotEmpty, IsNumber, IsOptional, IsString, IsArray } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";

export class CreateMunkaDto {
 
  @ApiProperty({
    description: 'A munka neve (egyedi)',
    example: 'API fejlesztés',
    type: 'string',
  })
  @IsString()
  @IsNotEmpty()
  munka_neve: string;

  @ApiPropertyOptional({
    description: 'A munka leírása',
    example: 'RESTful API fejlesztés a projekt számára',
    type: 'string',
  })
  @IsString()
  @IsOptional()
  leiras?: string;
 
  @ApiPropertyOptional({
    description: 'Az eszközök azonosítóinak tömbje, amely a munkához szükséges',
    example: [1, 2, 3],
    type: 'array',
    items: { type: 'number' },
  })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  eszkozok?: number[];
 
  @ApiPropertyOptional({
    description: 'A dolgozók (felhasználók) azonosítóinak tömbje',
    example: [1, 2],
    type: 'array',
    items: { type: 'number' },
  })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  dolgozok?: number[];

  @ApiPropertyOptional({
    description: 'Egyetlen eszköz azonosítója',
    example: 1,
    type: 'number',
  })
  @IsNumber()
  @IsOptional()
  eszkoz_id?: number;
 
  @ApiPropertyOptional({
    description: 'Egyetlen felhasználó azonosítója',
    example: 1,
    type: 'number',
  })
  @IsNumber()
  @IsOptional()
  user_id?: number;
 
  @ApiPropertyOptional({
    description: 'Az értesítés aktív státusza',
    example: false,
    type: 'boolean',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  ertesitesIsActive?: boolean;
 
  @ApiPropertyOptional({
    description: 'A munka aktív státusza',
    example: true,
    type: 'boolean',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
 
  @ApiPropertyOptional({
    description: 'A munka kezdeti dátuma',
    example: '2026-04-23T10:00:00Z',
    type: 'string',
    format: 'date-time',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  kezdeti_datum?: Date;
 
  @ApiPropertyOptional({
    description: 'A munka várható befejezési dátuma',
    example: '2026-05-23T17:00:00Z',
    type: 'string',
    format: 'date-time',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  varhato_befejezes_datuma?: Date;

  @ApiPropertyOptional({
    description: 'A feladatok leírásainak tömbje',
    example: ['Adatbázis megtervezése', 'API végpontok implementálása'],
    type: 'array',
    items: { type: 'string' },
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  feladatok?: string[];
 
}