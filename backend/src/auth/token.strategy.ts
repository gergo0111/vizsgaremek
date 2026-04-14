
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class TokenStrategy {
       constructor(private readonly db: PrismaService) {}

       async validate(token: string) {
              const tokenObj = await (this.db as any).token.findUnique({ where: { token } });
              if (!tokenObj) {
                     throw new UnauthorizedException('Invalid token');
              }
              const user = await (this.db as any).user.findUnique({ where: { user_id: tokenObj.user_id } });
              if (!user) {
                     throw new UnauthorizedException('User not found');
              }
              const { jelszo, ...userWithoutPassword } = user as any;
              return userWithoutPassword;
       }
}
