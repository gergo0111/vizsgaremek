import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";


@Injectable()
export class UserService {
       constructor(private prisma: PrismaService) {}
       async findAll() {
                    return (this.prisma as any).user.findMany();
       }

       async findOne(id: number) {
                    return (this.prisma as any).user.findUnique({ 
                     where: { user_id: id } 
              });
       }

       async create(data: CreateUserDto) {
                    return (this.prisma as any).user.create({
                     data
              })
       }

       async update(id:number, data: UpdateUserDto) {
                    return (this.prisma as any).user.update({
                     where: { user_id: id },
                     data
              })
       }

       async delete(id:number) {
                    return (this.prisma as any).user.delete({
                     where: { user_id: id }
              })
       }
}