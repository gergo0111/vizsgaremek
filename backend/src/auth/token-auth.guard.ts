import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { TokenStrategy } from './token.strategy';

@Injectable()
export class TokenAuthGuard implements CanActivate {
  constructor(private readonly tokenStrategy: TokenStrategy) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    // Allow login route and preflight without token so clients can obtain a token
    // (otherwise /auth/login would itself require authentication)
    const path = req.path || req.url || '';
    const method = (req.method || '').toUpperCase();
  if (method === 'OPTIONS') return true;
  // allow auth and user login/register endpoints to be public
  if (path === '/auth/login') return true;
  if (path === '/users/login') return true;
  if (path === '/users' && method === 'POST') return true;

    const authHeader = req.headers?.authorization || req.headers?.Authorization;
    let token: string | undefined;

    if (authHeader && typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
      token = authHeader.slice(7).trim();
    }

    if (!token && req.cookies && req.cookies.token) token = req.cookies.token;
    if (!token && req.query && req.query.token) token = String(req.query.token);

    if (!token) {
      throw new UnauthorizedException('Authentication token missing');
    }

    const user = await this.tokenStrategy.validate(token);

    req.user = user;
    return true;
  }
}
