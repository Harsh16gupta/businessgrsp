// lib/auth-admin.ts
import { NextRequest } from 'next/server';
import prisma from '@/lib/db';
import bcrypt from 'bcryptjs';

export interface AdminUser {
  id: string;
  phone: string;
  name: string;
  email: string | null;
  role: string;
}

export async function authenticateAdmin(request: NextRequest): Promise<AdminUser | null> {
  try {
    // Get phone and password from Authorization header (Basic Auth)
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Basic ')) {
      return null;
    }

    // Decode Basic Auth credentials
    const base64Credentials = authHeader.slice(6);
    const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
    const [phone, password] = credentials.split(':');

    if (!phone || !password) {
      return null;
    }

    // Find admin by phone
    const admin = await prisma.admin.findUnique({
      where: { 
        phone: phone.trim(),
        isActive: true 
      },
      select: {
        id: true,
        phone: true,
        password: true,
        name: true,
        email: true,
        role: true
      }
    });

    if (!admin) {
      console.log('❌ Admin not found:', phone);
      return null;
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    
    if (!isPasswordValid) {
      console.log('❌ Invalid password for admin:', phone);
      return null;
    }

    // Return admin user without password
    const { password: _, ...adminWithoutPassword } = admin;
    return adminWithoutPassword;

  } catch (error) {
    console.error('Admin authentication error:', error);
    return null;
  }
}

export function requireAdmin(admin: AdminUser | null) {
  if (!admin || admin.role !== 'ADMIN') {
    throw new Error('Admin access required');
  }
}