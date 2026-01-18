import { Module } from '@nestjs/common';
import { MunkaService } from './munka.service';
import { MunkaController } from './munka.controller';

@Module({
  controllers: [MunkaController],
  providers: [MunkaService],
})
export class MunkaModule {}
