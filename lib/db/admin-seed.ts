// scripts/admin-seed.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seedAdmin() {
  try {
    console.log('🌱 Seeding admin user...');

    const adminPhone = process.env.ADMIN_PHONE || '1234567890';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    // Create or update admin user
    const admin = await prisma.admin.upsert({
      where: { phone: adminPhone },
      update: {
        password: hashedPassword,
        name: 'System Administrator',
        email: 'admin@grsp.com',
        isActive: true
      },
      create: {
        phone: adminPhone,
        password: hashedPassword,
        name: 'System Administrator',
        email: 'admin@grsp.com',
        role: 'ADMIN',
        isActive: true
      }
    });

    console.log('✅ Admin user seeded successfully:');
    console.log(`   Phone: ${admin.phone}`);
    console.log(`   Name: ${admin.name}`);
    console.log(`   Email: ${admin.email}`);

  } catch (error) {
    console.error('❌ Error seeding admin:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seedAdmin();