import { Injectable } from '@nestjs/common';
import { PrismaService } from "src/prisma.service";
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';


@Injectable()
export class CommentService {
       constructor(private prisma: PrismaService) {}
       async findAll() {
                    return (this.prisma as any).comment.findMany();
       }

       async findOne(id: number) {
                    return (this.prisma as any).comment.findUnique({ 
                     where: { comment_id: id } 
              });
       }

       async create(data: CreateCommentDto) {
                    return (this.prisma as any).comment.create({
                     data
              })
       }

       async update(id:number, data: UpdateCommentDto) {
                    return (this.prisma as any).comment.update({
                     where: { comment_id: id },
                     data
              })
       }

       async delete(id:number) {
                    return (this.prisma as any).comment.delete({
                     where: { comment_id: id }
              })
       }
}