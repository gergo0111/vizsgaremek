import { IsBoolean, IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
 
export class CreateMunkaDto {
 
  @IsString()
  @IsNotEmpty()
  munka_neve: string;
 
  @IsNumber()
  @IsNotEmpty()
  eszkoz_id: number;
 
  @IsNumber()
  @IsNotEmpty()
  user_id: number;
 
  @IsOptional()
  @IsBoolean()
  ertesitesIsActive: boolean;
 
  @IsOptional()
  @IsBoolean()
  isActive: boolean;
 
  @IsNotEmpty()
  @IsDate()
  kezdeti_datum: Date;
 
  @IsNotEmpty()
  @IsDate()
  varhato_befejezes_datuma: Date;
 
}
 