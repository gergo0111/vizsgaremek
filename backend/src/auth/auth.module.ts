import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from 'src/prisma.service';
import { UserService } from 'src/user/user.service';
import { TokenStrategy } from './token.strategy';
import { TokenAuthGuard } from './token-auth.guard';

@Module({
  controllers: [AuthController],
  providers: [AuthService, PrismaService, UserService, TokenStrategy, TokenAuthGuard],
  exports: [TokenStrategy, TokenAuthGuard],
})
export class AuthModule {}
