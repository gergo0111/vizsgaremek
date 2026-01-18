import { Module } from '@nestjs/common';
import { FeladatService } from './feladat.service';
import { FeladatController } from './feladat.controller';

@Module({
  controllers: [FeladatController],
  providers: [FeladatService],
})
export class FeladatModule {}
