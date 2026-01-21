import { Module } from '@nestjs/common';
import { EszkozService } from './eszkoz.service';
import { EszkozController } from './eszkoz.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [EszkozController],
  providers: [EszkozService, PrismaService],
})
export class EszkozModule {}
