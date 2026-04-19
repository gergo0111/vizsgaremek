import { Injectable } from '@nestjs/common';
import { PrismaService } from "src/prisma.service";
import { CreateMunkaDto } from './dto/create-munka.dto';
import { UpdateMunkaDto } from './dto/update-munka.dto';

@Injectable()
export class MunkaService {
       constructor(private prisma: PrismaService) {}
       
       async findAll(isAdmin?: boolean, userId?: number) {
              if (isAdmin) {
                     return (this.prisma as any).munka.findMany({
                            include: {
                                   feladat: true,
                                   munkaUsers: {
                                          include: { user: true }
                                   },
                                   munkaEszkozok: {
                                          include: { eszkoz: true }
                                   }
                            },
                     });
              }
              
              return (this.prisma as any).munka.findMany({
                     where: {
                            munkaUsers: {
                                   some: {
                                          user_id: userId
                                   }
                            }
                     },
                     include: {
                            feladat: true,
                            munkaUsers: {
                                   include: { user: true }
                            },
                            munkaEszkozok: {
                                   include: { eszkoz: true }
                            }
                     },
              });
       }

       async findOne(id: number) {
              return (this.prisma as any).munka.findUnique({
                     where: { munka_id: id },
                     include: {
                            feladat: true,
                            munkaUsers: {
                                   include: { user: true }
                            },
                            munkaEszkozok: {
                                   include: { eszkoz: true }
                            }
                     },
              });
       }

       async create(data: any) {
              const dolgozok: number[] = Array.isArray(data.dolgozok) ? data.dolgozok : [data.user_id].filter(Boolean);
              const eszkozok: number[] = Array.isArray(data.eszkozok) ? data.eszkozok : [data.eszkoz_id].filter(Boolean);
              const feladatok: string[] = Array.isArray(data.feladatok) ? data.feladatok : [];

              if (dolgozok.length === 0 && data.user_id) dolgozok.push(data.user_id);
              if (eszkozok.length === 0 && data.eszkoz_id) eszkozok.push(data.eszkoz_id);

              const baseName = data.nev || `Munka ${new Date().toISOString()}`;
              const uniqueName = `${baseName}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

              const munka = await (this.prisma as any).munka.create({
                     data: {
                            munka_neve: uniqueName,
                            leiras: data.leiras || '',
                            kezdeti_datum: data.kezdetiDatum ? new Date(data.kezdetiDatum) : undefined,
                            varhato_befejezes_datuma: data.velemenyDatum ? new Date(data.velemenyDatum) : undefined,
                            ertesitesIsActive: data.ertesitesIsActive ?? false,
                            isActive: data.isActive ?? true
                     }
              });

              for (const user_id of dolgozok) {
                     await (this.prisma as any).munkaUser.create({
                            data: {
                                   munka_id: munka.munka_id,
                                   user_id
                            }
                     });
              }

              for (const eszkoz_id of eszkozok) {
                     try {
                            await (this.prisma as any).eszkoz.update({
                                   where: { eszkoz_id },
                                   data: { hasznalatban: true }
                            });
                     } catch (e) {
                            console.warn(`Eszkoz with id ${eszkoz_id} not found, skipping hasznalatban update.`);
                     }

                     await (this.prisma as any).munkaEszkoz.create({
                            data: {
                                   munka_id: munka.munka_id,
                                   eszkoz_id
                            }
                     });
              }

              for (const f of feladatok) {
                     if (f && f.trim() !== "") {
                            await (this.prisma as any).feladat.create({
                                   data: {
                                          munka_id: munka.munka_id,
                                          leiras: f,
                                   }
                            });
                     }
              }

              return (this.prisma as any).munka.findUnique({
                     where: { munka_id: munka.munka_id },
                     include: {
                            feladat: true,
                            munkaUsers: {
                                   include: { user: true }
                            },
                            munkaEszkozok: {
                                   include: { eszkoz: true }
                            }
                     }
              });
       }

       async update(id: number, data: UpdateMunkaDto) {
              const updateData: any = {
                     munka_neve: data.munka_neve,
                     leiras: data.leiras,
                     kezdeti_datum: data.kezdeti_datum,
                     varhato_befejezes_datuma: data.varhato_befejezes_datuma,
                     ertesitesIsActive: data.ertesitesIsActive,
                     isActive: data.isActive
              };

              Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

              const munka = await (this.prisma as any).munka.update({
                     where: { munka_id: id },
                     data: updateData,
                     include: {
                            feladat: true,
                            munkaUsers: {
                                   include: { user: true }
                            },
                            munkaEszkozok: {
                                   include: { eszkoz: true }
                            }
                     }
              });

              if (data.dolgozok && Array.isArray(data.dolgozok)) {
                     await (this.prisma as any).munkaUser.deleteMany({
                            where: { munka_id: id }
                     });

                     for (const user_id of data.dolgozok) {
                            await (this.prisma as any).munkaUser.create({
                                   data: {
                                          munka_id: id,
                                          user_id
                                   }
                            });
                     }
              }

              if (data.eszkozok && Array.isArray(data.eszkozok)) {
                     await (this.prisma as any).munkaEszkoz.deleteMany({
                            where: { munka_id: id }
                     });

                     for (const eszkoz_id of data.eszkozok) {
                            try {
                                   await (this.prisma as any).eszkoz.update({
                                          where: { eszkoz_id },
                                          data: { hasznalatban: true }
                                   });
                            } catch (e) {
                                   console.warn(`Eszkoz with id ${eszkoz_id} not found, skipping hasznalatban update.`);
                            }

                            await (this.prisma as any).munkaEszkoz.create({
                                   data: {
                                          munka_id: id,
                                          eszkoz_id
                                   }
                            });
                     }
              }

              return (this.prisma as any).munka.findUnique({
                     where: { munka_id: id },
                     include: {
                            feladat: true,
                            munkaUsers: {
                                   include: { user: true }
                            },
                            munkaEszkozok: {
                                   include: { eszkoz: true }
                            }
                     }
              });
       }

       async delete(id: number) {
              return (this.prisma as any).munka.delete({
                     where: { munka_id: id }
              })
       }
}