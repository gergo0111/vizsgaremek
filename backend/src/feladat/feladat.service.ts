import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { CreateFeladatDto } from "./dto/create-feladat.dto";
import { UpdateFeladatDto } from "./dto/update-feladat.dto";


@Injectable()
export class FeladatService {
       constructor(private prisma: PrismaService) {}
       async findAll() {
                    return (this.prisma as any).feladat.findMany();
       }

       async findOne(id: number) {
                    return (this.prisma as any).feladat.findUnique({ 
                     where: { feladat_id: id } 
              });
       }

       async create(data: CreateFeladatDto) {
                    return (this.prisma as any).feladat.create({
                     data
              })
       }

       async update(id:number, data: UpdateFeladatDto) {
                    return (this.prisma as any).feladat.update({
                     where: { feladat_id: id },
                     data
              })
       }

       async delete(id:number) {
                    return (this.prisma as any).feladat.delete({
                     where: { feladat_id: id }
              })
       }
}