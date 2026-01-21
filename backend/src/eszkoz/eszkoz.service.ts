import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { CreateEszkozDto } from "./dto/create-eszkoz.dto";
import { UpdateEszkozDto } from "./dto/update-eszkoz.dto";


@Injectable()
export class EszkozService {
       constructor(private prisma: PrismaService) {}
       async findAll() {
                    return (this.prisma as any).eszkoz.findMany();
       }

       async findOne(id: number) {
                    return (this.prisma as any).eszkoz.findUnique({ 
                     where: { eszkoz_id: id } 
              });
       }

       async create(data: CreateEszkozDto) {
                    return (this.prisma as any).eszkoz.create({
                     data
              })
       }

       async update(id:number, data: UpdateEszkozDto) {
                    return (this.prisma as any).eszkoz.update({
                     where: { eszkoz_id: id },
                     data
              })
       }

       async delete(id:number) {
                    return (this.prisma as any).eszkoz.delete({
                     where: { eszkoz_id: id }
              })
       }
}