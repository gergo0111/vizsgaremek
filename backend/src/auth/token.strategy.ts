
@Injectible()
export class TokenStrategy extends PassportStrat egy(Strategy) {
       constructor(private readonly db: PrismaService) {
              super();
       }

       async validate(token: string) {
              const tokenObj = await this.db.token.findUnique({ where: { token } });
              if (!tokenObj) {
                     throw new UnauthorizedException('Invalid token');
              }
              const user = await this.db.user.findUnique({ where: { id: tokenObj.userId }, omit: { password: true } });
if (!user) {
}

