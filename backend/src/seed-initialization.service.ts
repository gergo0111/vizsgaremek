import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedInitializationService implements OnModuleInit {
  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    console.log('Adatbázis inicializálása...\n');

    const adminUsername = 'admin';
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123';
    const adminName = 'Administrator';
    const userPassword = 'felhasznalo123';
    const saltRounds = 10;

    try {
      console.log('Meglévő adatok törlése...');
      await (this.prisma as any).comment.deleteMany({});
      await (this.prisma as any).feladat.deleteMany({});
      await (this.prisma as any).munka.deleteMany({});
      await (this.prisma as any).eszkoz.deleteMany({});
      await (this.prisma as any).user.deleteMany({});
      console.log('✅ Meglévő adatok törölve\n');

      console.log('👤 Admin felhasználó létrehozása...');
      const hashedAdminPassword = await bcrypt.hash(adminPassword, saltRounds);

      const admin = await (this.prisma as any).user.create({
        data: {
          felhasznalonev: adminUsername,
          email: adminEmail,
          jelszo: hashedAdminPassword,
          nev: adminName,
          munkakor: 'Administrator',
          munkaora: 8,
          isActive: true,
          isAdmin: true,
        },
      });

      console.log('Admin felhasználó sikeresen létrehozva:');
      console.log(`   Felhasználónév: ${admin.felhasznalonev}`);
      console.log(`   E-mail: ${admin.email}`);
      console.log(`   Jelszó: ${adminPassword}`);
      console.log(`   Admin jogosultság: Igen\n`);

      console.log('10 felhasználó létrehozása...');
      const hashedUserPassword = await bcrypt.hash(userPassword, saltRounds);
      const users: any[] = [];

      for (let i = 1; i <= 10; i++) {
        const user = await (this.prisma as any).user.create({
          data: {
            felhasznalonev: `felhasznalo${i}`,
            email: `felhasznalo${i}@example.com`,
            jelszo: hashedUserPassword,
            nev: `Felhasználó ${i}`,
            munkakor: `Munkakör ${i}`,
            munkaora: 8,
            isActive: true,
            isAdmin: false,
          },
        });
        users.push(user);
      }
      console.log(`10 felhasználó sikeresen létrehozva\n`);

      console.log('10 eszköz létrehozása...');
      const eszkozok: any[] = [];

      for (let i = 1; i <= 10; i++) {
        const eszkoz = await (this.prisma as any).eszkoz.create({
          data: {
            nev: `Eszköz ${i}`,
            tipus: `Típus ${i}`,
            darabszam: i,
            hasznalatban: i % 2 === 0,
          },
        });
        eszkozok.push(eszkoz);
      }
      console.log(`✅ 10 eszköz sikeresen létrehozva\n`);

      console.log('10 munka és feladatok létrehozása...');
      const munkak: any[] = [];

      for (let i = 1; i <= 10; i++) {
        const varhato_datum = new Date(2026, Math.floor((i - 1) / 2), (i % 28) + 1);
        const munka = await (this.prisma as any).munka.create({
          data: {
            munka_neve: `Munka ${i}`,
            leiras: `Ez a munka ${i} leírása`,
            eszkoz_id: eszkozok[(i - 1) % 10].eszkoz_id,
            user_id: users[(i - 1) % 10].user_id,
            ertesitesIsActive: i % 2 === 0,
            isActive: true,
            varhato_befejezes_datuma: varhato_datum,
          },
        });
        munkak.push(munka);

        const feladatSzam = Math.floor(Math.random() * 4) + 2;
        for (let j = 1; j <= feladatSzam; j++) {
          await (this.prisma as any).feladat.create({
            data: {
              munka_id: munka.munka_id,
              leiras: `Feladat ${j} - ${munka.munka_neve}`,
              isCompleted: j % 3 === 0,
              isActive: true,
            },
          });
        }
      }
      console.log(`✅ 10 munka és feladatok sikeresen létrehozva\n`);

      console.log('Adatbázis inicializálása sikeresen befejeződött!\n');
    } catch (error) {
      console.error('❌ Hiba az adatbázis inicializálása során:', error);
      throw error;
    }
  }
}
