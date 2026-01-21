import { IsBoolean, IsDate, IsNotEmpty, IsNumber, IsString } from "class-validator";
 
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
 
  @IsNotEmpty()
  @IsBoolean()
  ertesitesIsActive: boolean;
 
  @IsNotEmpty()
  @IsBoolean()
  isActive: boolean;
 
  @IsNotEmpty()
  @IsDate()
  kezdeti_datum: Date;
 
  @IsNotEmpty()
  @IsDate()
  varhato_befejezes_datuma: Date;
 
}
 