import { Controller, Post, Body, Res } from '@nestjs/common'; // Tambahkan Res
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import type { Response } from 'express'; // Import dari express

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('register')
  async register(@Body() body: CreateUserDto) {
    return this.authService.register(body.email, body.password);
  }

  @Post('login')
  async login(@Body() body: LoginDto, @Res({ passthrough: true }) response: Response) {
    const loginData = await this.authService.login(body.email, body.password);

    // Kirim token lewat cookie
    response.cookie('access_token', loginData.access_token, {
      httpOnly: true,     // JS tidak bisa baca cookie (Aman dari XSS)
      secure: false,       // Set TRUE jika sudah pakai HTTPS
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24, // 1 hari
    });

    return { message: 'Login sukses' };
  }
}