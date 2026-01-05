import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
    @IsEmail({}, { message: 'Email tidak valid' })
    @IsNotEmpty({ message: 'Email tidak boleh kosong' })
    email: string;

    @IsNotEmpty({ message: 'Password tidak boleh kosong' })
    password: string;
}
