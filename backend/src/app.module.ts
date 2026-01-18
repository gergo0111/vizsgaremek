import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { EszkozModule } from './eszkoz/eszkoz.module';
import { FeladatModule } from './feladat/feladat.module';
import { MunkaModule } from './munka/munka.module';
import { CommentModule } from './comment/comment.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
  }), UserModule, EszkozModule, FeladatModule, MunkaModule, CommentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
