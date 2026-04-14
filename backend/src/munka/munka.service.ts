import { Injectable } from '@nestjs/common';
import { PrismaService } from "src/prisma.service";
import { CreateMunkaDto } from './dto/create-munka.dto';
import { UpdateMunkaDto } from './dto/update-munka.dto';

@Injectable()
export class MunkaService {
       constructor(private prisma: PrismaService) {}
       async findAll(isAdmin?: boolean, userId?: number) {
              const where = !isAdmin && userId ? { user_id: userId } : undefined;
              return (this.prisma as any).munka.findMany({
                     where,
                     include: {
                            feladat: true,
                     },
              });
       }

       async findOne(id: number) {
                                   return (this.prisma as any).munka.findUnique({
                                          where: { munka_id: id },
                                          include: {
                                                 feladat: true,
                                          },
                                   });
       }

         
         async create(data: any) {
                            const created: any[] = [];

                            const dolgozok: number[] = Array.isArray(data.dolgozok) ? data.dolgozok : [data.user_id].filter(Boolean);
                            const eszkozok: number[] = Array.isArray(data.eszkozok) ? data.eszkozok : [data.eszkoz_id].filter(Boolean);
                            const feladatok: string[] = Array.isArray(data.feladatok) ? data.feladatok : [];

                     
                            if (dolgozok.length === 0 && data.user_id) dolgozok.push(data.user_id);
                            if (eszkozok.length === 0 && data.eszkoz_id) eszkozok.push(data.eszkoz_id);

                            for (const eszkoz_id of eszkozok) {
                                   try {
                                          await (this.prisma as any).eszkoz.update({
                                                 where: { eszkoz_id },
                                                 data: { hasznalatban: true }
                                          });
                                   } catch (e) {
                                          console.warn(`Eszkoz with id ${eszkoz_id} not found, skipping hasznalatban update.`);
                                   }

                                   for (const user_id of dolgozok) {
                                          let baseName = data.nev || `Munka ${new Date().toISOString()}`;
                                          let munkaNeve = baseName;
                                          munkaNeve = `${baseName} (u${user_id}-e${eszkoz_id})`;

                                          const munka = await (this.prisma as any).munka.create({
                                                 data: {
                                                        munka_neve: munkaNeve,
                                                        leiras: data.leiras || '',
                                                        eszkoz_id,
                                                        user_id,
                                                        kezdeti_datum: data.kezdetiDatum ? new Date(data.kezdetiDatum) : undefined,
                                                        varhato_befejezes_datuma: data.velemenyDatum ? new Date(data.velemenyDatum) : undefined,
                                                        ertesitesIsActive: data.ertesitesIsActive ?? false,
                                                        isActive: data.isActive ?? true
                                                 }
                                          });

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

                                          created.push(munka);
                                   }
                            }

                            return created.length === 1 ? created[0] : created;
         }

       async update(id:number, data: UpdateMunkaDto) {
                    return (this.prisma as any).munka.update({
                     where: { munka_id: id },
                     data
              })
       }

       async delete(id:number) {
                    return (this.prisma as any).munka.delete({
                     where: { munka_id: id }
              })
       }
}