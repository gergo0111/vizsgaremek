import { Injectable } from '@nestjs/common';
import { PrismaService } from "src/prisma.service";
import { CreateMunkaDto } from './dto/create-munka.dto';
import { UpdateMunkaDto } from './dto/update-munka.dto';

@Injectable()
export class MunkaService {
       constructor(private prisma: PrismaService) {}
       async findAll() {
                    return (this.prisma as any).munka.findMany();
       }

       async findOne(id: number) {
                    return (this.prisma as any).munka.findUnique({ 
                     where: { munka_id: id } 
              });
       }

       async create(data: CreateMunkaDto) {
                    return (this.prisma as any).munka.create({
                     data
              })
       }

       async update(id:number, data: UpdateMunkaDto) {
                    return (this.prisma as any).munka.update({
                     where: { munka_id: id },
                     data
              })
       }

       async delete(id:number) {
                    return (this.prisma as any).munka.delete({
                     where: { munka_id: id }
              })
       }
}