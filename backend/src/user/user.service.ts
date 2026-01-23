import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { LoginUserDto } from "./dto/login-user.dto";
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
       constructor(private prisma: PrismaService) {}
       
       async findAll() {
                    return (this.prisma as any).user.findMany();
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
                    return (this.prisma as any).user.delete({
                     where: { user_id: id }
              })
       }

       // Login method
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
                    
                    return {
                              message: 'Sikeres bejelentkezés',
                              user: userWithoutPassword
                    };
       }

       async verifyPassword(plainTextPassword: string, hashedPassword: string): Promise<boolean> {
                    return bcrypt.compare(plainTextPassword, hashedPassword);
       }
}