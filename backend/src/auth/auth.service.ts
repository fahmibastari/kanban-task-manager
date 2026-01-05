import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService,) { }

  async register(email: string, pass: string) {
    // 1. Cek apakah email sudah terdaftar
    const userExists = await this.usersService.findByEmail(email);
    if (userExists) {
      throw new BadRequestException('Email already exists');
    }

    // 2. Hash password (diacak 10x)
    const hashedPassword = await bcrypt.hash(pass, 10);

    // 3. Simpan ke database
    const newUser = await this.usersService.create({
      email,
      password: hashedPassword,
    });

    // 4. Kembalikan data tanpa password
    const { password, ...result } = newUser;
    return result;
  }
  async login(email: string, pass: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Email atau password salah');
    }

    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Email atau password salah');
    }

    const payload = { sub: user.id, email: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
