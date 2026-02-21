import { Injectable } from '@nestjs/common';
import speakeasy from 'speakeasy';
import qrcode from 'qrcode';

@Injectable()
export class TwoFaService {
  generateSecret = (email: string) => {
    const secret = speakeasy.generateSecret({
      name: `Pomodoro App ${email}`,
    });
    return secret;
  };
  generateQRCode = async (otpauthUrl: string) => {
    return await qrcode.toDataURL(otpauthUrl);
  };

  verifyCode = (secret: string, code: string): boolean => {
    return speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token: code,
      window: 1,
    });
  };
}
