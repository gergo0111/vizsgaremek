import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminInitializationService implements OnModuleInit {
  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    console.log('🔍 Admin felhasználó ellenőrzése...');
    
    const adminUsername = 'admin';
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123';
    const adminName = 'Administrator';

    try {
      const existingAdmin = await (this.prisma as any).user.findUnique({
        where: { felhasznalonev: adminUsername },
      });

      if (existingAdmin) {
        console.log('⚠️  Admin felhasználó már létezik, törlésre kerül...');
        await (this.prisma as any).user.delete({
          where: { user_id: existingAdmin.user_id },
        });
        console.log('✅ Admin felhasználó sikeresen törölve');
      }

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(adminPassword, saltRounds);

      const admin = await (this.prisma as any).user.create({
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

      console.log('✅ Admin felhasználó inicializálva:');
      console.log(`   👤 Felhasználónév: ${admin.felhasznalonev}`);
      console.log(`   📧 E-mail: ${admin.email}`);
      console.log(`   🔐 Jelszó: ${adminPassword}`);
      console.log(`   ⭐ Admin jogosultság: Igen\n`);
    } catch (error) {
      console.error('❌ Hiba az admin felhasználó inicializálása során:', error);
    }
  }
}
