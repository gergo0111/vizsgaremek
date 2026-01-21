import { Module } from '@nestjs/common';
import { MunkaService } from './munka.service';
import { MunkaController } from './munka.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [MunkaController],
  providers: [MunkaService, PrismaService],
})
export class MunkaModule {}
