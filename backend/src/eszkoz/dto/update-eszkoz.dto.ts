import { PartialType } from '@nestjs/mapped-types';
import { CreateEszkozDto } from './create-eszkoz.dto';

export class UpdateEszkozDto extends PartialType(CreateEszkozDto) {}
