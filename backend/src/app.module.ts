import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { EszkozModule } from './eszkoz/eszkoz.module';
import { FeladatModule } from './feladat/feladat.module';
import { MunkaModule } from './munka/munka.module';
import { CommentModule } from './comment/comment.module';
import { SeedInitializationService } from './seed-initialization.service';
import { PrismaService } from './prisma.service';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
  }), AuthModule, UserModule, EszkozModule, FeladatModule, MunkaModule, CommentModule],
  controllers: [AppController],
  providers: [AppService, SeedInitializationService, PrismaService],
})
export class AppModule {}
