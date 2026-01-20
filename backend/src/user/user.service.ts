import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findAll(){
    return this.prisma.user.findMany();
  }

  async findOne(id: number){
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async create(data: CreateUserDto){
    return this.prisma.user.create({
      data,
    });
  }

  async update(id: number, data: UpdateUserDto){
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async delete(id: number){
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
