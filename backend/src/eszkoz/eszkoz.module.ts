import { Module } from '@nestjs/common';
import { EszkozService } from './eszkoz.service';
import { EszkozController } from './eszkoz.controller';

@Module({
  controllers: [EszkozController],
  providers: [EszkozService],
})
export class EszkozModule {}
