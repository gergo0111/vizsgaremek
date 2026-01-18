import { Injectable } from '@nestjs/common';
import { CreateEszkozDto } from './dto/create-eszkoz.dto';
import { UpdateEszkozDto } from './dto/update-eszkoz.dto';

@Injectable()
export class EszkozService {
  create(createEszkozDto: CreateEszkozDto) {
    return 'This action adds a new eszkoz';
  }

  findAll() {
    return `This action returns all eszkoz`;
  }

  findOne(id: number) {
    return `This action returns a #${id} eszkoz`;
  }

  update(id: number, updateEszkozDto: UpdateEszkozDto) {
    return `This action updates a #${id} eszkoz`;
  }

  remove(id: number) {
    return `This action removes a #${id} eszkoz`;
  }
}
