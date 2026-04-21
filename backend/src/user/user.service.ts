import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { randomUUID } from 'crypto';
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { LoginUserDto } from "./dto/login-user.dto";
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
       constructor(private prisma: PrismaService) {}
       
       async findAll() {
                           return (this.prisma as any).user.findMany({
                                  where: { isActive: true }
                           });
       }

       async findOne(id: number) {
                    return (this.prisma as any).user.findUnique({ 
                     where: { user_id: id } 
              });
       }

       async create(data: CreateUserDto) {
                    const saltRounds = 10;
                    const hashedPassword = await bcrypt.hash(data.jelszo, saltRounds);
                    
                    return (this.prisma as any).user.create({
                     data: {
                              ...data,
                              jelszo: hashedPassword
                     }
              })
       }

       async update(id: number, data: UpdateUserDto) {
                    if (data.jelszo) {
                              const saltRounds = 10;
                              data.jelszo = await bcrypt.hash(data.jelszo, saltRounds);
                    }
                    
                    return (this.prisma as any).user.update({
                     where: { user_id: id },
                     data
              })
       }

       async delete(id: number) {
                           return (this.prisma as any).user.update({
                            where: { user_id: id },
                            data: { isActive: false }
                     })
       }

              async restore(id: number) {
                           return (this.prisma as any).user.update({
                            where: { user_id: id },
                            data: { isActive: true }
                     })
              }

              async findDeleted() {
                           return (this.prisma as any).user.findMany({
                                  where: { isActive: false }
                           });
              }

       async login(loginData: LoginUserDto) {
                    const user = await (this.prisma as any).user.findUnique({
                              where: { felhasznalonev: loginData.felhasznalonev }
                    });

                    if (!user) {
                              throw new UnauthorizedException('Hibás felhasználónév vagy jelszó');
                    }

                    const isPasswordValid = await bcrypt.compare(loginData.jelszo, user.jelszo);

                    if (!isPasswordValid) {
                              throw new UnauthorizedException('Hibás felhasználónév vagy jelszó');
                    }

                    const { jelszo, ...userWithoutPassword } = user;
                                  const tokenObj = await this.createToken((user as any).user_id ?? (user as any).id);
                                  return {
                                            message: 'Sikeres bejelentkezés',
                                            user: userWithoutPassword,
                                            token: tokenObj?.token || null,
                                  };
       }
              async findByEmail(email: string) {
                     return (this.prisma as any).user.findUnique({
                            where: { email },
                     });
              }

              async createToken(userId: number) {
                     const token = randomUUID();
                     return (this.prisma as any).token.create({
                            data: {
                                   token,
                                   user_id: userId,
                            },
                     });
              }

       async verifyPassword(plainTextPassword: string, hashedPassword: string): Promise<boolean> {
                    return bcrypt.compare(plainTextPassword, hashedPassword);
       }
}