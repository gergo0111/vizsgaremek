import { Injectable } from '@nestjs/common';
import { CreateFeladatDto } from './dto/create-feladat.dto';
import { UpdateFeladatDto } from './dto/update-feladat.dto';

@Injectable()
export class FeladatService {
  create(createFeladatDto: CreateFeladatDto) {
    return 'This action adds a new feladat';
  }

  findAll() {
    return `This action returns all feladat`;
  }

  findOne(id: number) {
    return `This action returns a #${id} feladat`;
  }

  update(id: number, updateFeladatDto: UpdateFeladatDto) {
    return `This action updates a #${id} feladat`;
  }

  remove(id: number) {
    return `This action removes a #${id} feladat`;
  }
}
