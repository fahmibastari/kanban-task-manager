import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma.service'; // Import ini

@Module({
  providers: [UsersService, PrismaService], // Tambahkan PrismaService di sini
  exports: [UsersService], // Export ini agar AuthService bisa pakai fungsi findByEmail
})
export class UsersModule {}
