import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(configService: ConfigService) {
    const jwtSecret = configService.get<string>('JWT_SECRET');
    //If jwtSecret is not defined, throw error
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined in the configuration!');
    }
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        (req: Request) => req?.cookies?.access_token ?? null,
      ]),
      secretOrKey: jwtSecret,
    });
  }

  validate({ email, id }: { email: string; id: string }) {
    return { id, email };
  }
}
