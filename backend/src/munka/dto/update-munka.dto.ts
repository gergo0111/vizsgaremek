import { PartialType } from '@nestjs/mapped-types';
import { CreateMunkaDto } from './create-munka.dto';

export class UpdateMunkaDto extends PartialType(CreateMunkaDto) {}
