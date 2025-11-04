import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { HttpModule } from '@nestjs/axios';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [
        HttpModule, // HTTP modulini import qilish
        JwtModule.register({ // JWT modulini sozlash 
            secret: `${process.env.SECRET_TOKEN_KEY}`, // .env fayldan o'qish
            signOptions: { expiresIn: '30d' }, // tokenning amal qilish muddati
        }),
    ],
  providers: [AuthService], // AuthService ni provider sifatida ro'yxatga olish
  exports: [AuthService, JwtModule], // AuthService ni boshqa modullarda ishlatish uchun export qilish
})
export class AuthModule {}
