import { Injectable } from '@nestjs/common';
import { CreateMunkaDto } from './dto/create-munka.dto';
import { UpdateMunkaDto } from './dto/update-munka.dto';

@Injectable()
export class MunkaService {
  create(createMunkaDto: CreateMunkaDto) {
    return 'This action adds a new munka';
  }

  findAll() {
    return `This action returns all munka`;
  }

  findOne(id: number) {
    return `This action returns a #${id} munka`;
  }

  update(id: number, updateMunkaDto: UpdateMunkaDto) {
    return `This action updates a #${id} munka`;
  }

  remove(id: number) {
    return `This action removes a #${id} munka`;
  }
}
