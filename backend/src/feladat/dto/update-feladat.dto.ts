import { PartialType } from '@nestjs/mapped-types';
import { CreateFeladatDto } from './create-feladat.dto';

export class UpdateFeladatDto extends PartialType(CreateFeladatDto) {}
