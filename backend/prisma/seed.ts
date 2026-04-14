import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Admin felhasználó inicializálása...');

  const adminUsername = 'admin';
  const adminEmail = 'admin@example.com';
  const adminPassword = 'Admin123';
  const adminName = 'Administrator';

  try {
    const existingAdmin = await prisma.user.findUnique({
      where: { felhasznalonev: adminUsername },
    });

    if (existingAdmin) {
      console.log('⚠️  Admin felhasználó már létezik, törlésre kerül...');
      await prisma.user.delete({
        where: { user_id: existingAdmin.user_id },
      });
      console.log('✅ Admin felhasználó sikeresen törölve');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(adminPassword, saltRounds);


    const admin = await prisma.user.create({
      data: {
        felhasznalonev: adminUsername,
        email: adminEmail,
        jelszo: hashedPassword,
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
    console.log(`   Admin jogosultság: Igen`);
  } catch (error) {
    console.error('❌ Hiba a seeding során:', error);
    throw error;
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log('✅ Seeding befejezve\n');
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
