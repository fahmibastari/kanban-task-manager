import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            // 1. Ambil token dari cookie 'access_token'
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: Request) => {
                    return request?.cookies?.access_token;
                },
            ]),
            ignoreExpiration: false,
            // TODO: Pindahkan ke .env nanti
            secretOrKey: 'RAHASIA_NEGARA_123',
        });
    }

    // 2. Payload hasil decode token akan masuk ke sini
    async validate(payload: any) {
        // Return object yang akan ditempel ke request.user
        return { userId: payload.sub, email: payload.email };
    }
}
