import { Module } from '@nestjs/common';
import { FeladatService } from './feladat.service';
import { FeladatController } from './feladat.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [FeladatController],
  providers: [FeladatService, PrismaService],
})
export class FeladatModule {}
