import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Pakai as any supaya TS tidak protes soal call signature
  app.use((cookieParser as any)());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Hapus properti yang tidak ada di DTO
      forbidNonWhitelisted: true, // Error jika ada properti asing
      transform: true, // Otomatis transform payload ke instance DTO
    }),
  );

  // Ingat: Cors bukan CORS (huruf s-nya kecil)
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  await app.listen(3001);
}
// Tambahkan void untuk memuaskan ESLint soal floating promise
void bootstrap();