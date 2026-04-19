import { IsBoolean, IsDate, IsNotEmpty, IsNumber, IsOptional, IsString, IsArray } from "class-validator";
 
export class CreateMunkaDto {
 
  @IsString()
  @IsNotEmpty()
  munka_neve: string;

  @IsString()
  @IsOptional()
  leiras?: string;
 
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  eszkozok?: number[];
 
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  dolgozok?: number[];

  @IsNumber()
  @IsOptional()
  eszkoz_id?: number;
 
  @IsNumber()
  @IsOptional()
  user_id?: number;
 
  @IsOptional()
  @IsBoolean()
  ertesitesIsActive?: boolean;
 
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
 
  @IsOptional()
  @IsDate()
  kezdeti_datum?: Date;
 
  @IsOptional()
  @IsDate()
  varhato_befejezes_datuma?: Date;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  feladatok?: string[];
 
}
 
 