import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {

  const adminUsername = 'admin';
  const adminEmail = 'admin@example.com';
  const adminPassword = 'Admin123';
  const adminName = 'Administrator';
  const userPassword = 'Felhasznalo123';
  const saltRounds = 10;

  try {

    console.log('Meglévő adatok törlése...');
    await prisma.comment.deleteMany({});
    await prisma.feladat.deleteMany({});
    await prisma.munka.deleteMany({});
    await prisma.eszkoz.deleteMany({});
    await prisma.user.deleteMany({});
    console.log('✅ Meglévő adatok törölve\n');

    console.log('Admin felhasználó létrehozása...');
    const hashedAdminPassword = await bcrypt.hash(adminPassword, saltRounds);

    const admin = await prisma.user.create({
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

    console.log('✅ Admin felhasználó sikeresen létrehozva:');
    console.log(`   Felhasználónév: ${admin.felhasznalonev}`);
    console.log(`   E-mail: ${admin.email}`);
    console.log(`   Jelszó: ${adminPassword}`);
    console.log(`   Admin jogosultság: Igen\n`);

  
    console.log('10 felhasználó létrehozása...');
    const hashedUserPassword = await bcrypt.hash(userPassword, saltRounds);
    const users: any[] = [];

    for (let i = 1; i <= 10; i++) {
      const user = await prisma.user.create({
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
    console.log(`✅ 10 felhasználó sikeresen létrehozva\n`);

    console.log('10 eszköz létrehozása...');
    const eszkozok: any[] = [];

    for (let i = 1; i <= 10; i++) {
      const eszkoz = await prisma.eszkoz.create({
        data: {
          nev: `Eszköz ${i}`,
          tipus: `Típus ${i}`,
          darabszam: Math.max(1, i),
          hasznalatban: i % 2 === 0,
        },
      });
      eszkozok.push(eszkoz);
    }
    console.log(`✅ 10 eszköz sikeresen létrehozva\n`);

    console.log('10 munka létrehozása...');

    for (let i = 1; i <= 10; i++) {
      const kezdeti_datum = new Date(2026, 0, i % 28 + 1);
      const varhato_befejezes_datuma = new Date(kezdeti_datum);
      varhato_befejezes_datuma.setDate(varhato_befejezes_datuma.getDate() + Math.floor(i / 2) + 1);
      
      await prisma.munka.create({
        data: {
          munka_neve: `Munka ${i}`,
          leiras: `Ez a munka ${i} leírása`,
          eszkoz_id: eszkozok[(i - 1) % 10].eszkoz_id,
          user_id: users[(i - 1) % 10].user_id,
          ertesitesIsActive: i % 2 === 0,
          isActive: true,
          kezdeti_datum: kezdeti_datum,
          varhato_befejezes_datuma: varhato_befejezes_datuma,
        },
      });
    }
    console.log(`✅ 10 munka sikeresen létrehozva\n`);

  } catch (error) {
    console.error('Hiba a seeding során:', error);
    throw error;
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log('Seeding befejezve\n');
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
