import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
       @ApiProperty({
              description: 'Felhasználó email címe',
              example: 'nagy.janos@example.com',
              type: 'string',
              format: 'email',
       })
       @IsNotEmpty()
       @IsString()
       email: string;

       @ApiProperty({
              description: 'Felhasználó jelszava',
              example: 'SecurePass123!',
              type: 'string',
       })
       @IsNotEmpty()
       @IsString()
       password: string;
}