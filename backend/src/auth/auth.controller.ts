import { TwoFaService } from './two-fa.service';
import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { LoginDTO } from './dto/login.dto';
import { UsersService } from 'src/users/users.service';
import { AuthGuard } from '@nestjs/passport';
import { TwoFaGuard } from './twofa.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
    private twoFaService: TwoFaService,
  ) {}

  //Register new user route
  @Post('register')
  async register(
    @Body() createUserDto: CreateUserDTO,
  ): Promise<{ token: string }> {
    const token = await this.authService.register(createUserDto);
    return { token };
  }

  //Login route
  @Post('login')
  async login(
    @Body() loginDto: LoginDTO,
    @Res({ passthrough: true }) res: any,
  ): Promise<{ message: string; twoFARequired?: boolean }> {
    const { token, user } = await this.authService.login(loginDto);
    if (user.twoFAEnabled) {
      res.cookie('pending_user', user.id, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 5 * 60 * 1000, //5min
      });
      return { message: '2FA required.', twoFARequired: true };
    }
    res.cookie('access_token', token, {
      httpOnly: true, //make cookie unaccessible to JS
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/', //Cookie path
      maxAge: 24 * 60 * 60 * 1000, //1 day
    });
    return { message: 'Login successfully, token set in cookie.' };
  }

  //Logout route
  @Post('logout')
  logout(@Res({ passthrough: true }) res: any): { message: string } {
    res.clearCookie('access_token');
    return { message: 'Logout successfully. Cookie cleared.' };
  }

  //Profile route
  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  async profile(@Req() req: any): Promise<{ email: string }> {
    const user = await this.userService.findUserByEmail(req.user.email);
    if (!user) throw new Error('User not found!');
    return { email: user.email };
  }

  //Google auth
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req: any) {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(
    @Req() req: any,
    @Res({ passthrough: true }) res: any,
  ) {
    const user = req.user;
    const token = await this.authService.socialLogin(user);

    res.cookie('access_token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000, //1day
    });
    res.redirect('http://localhost:3000/dashboard');
  }

  //Github auth
  @Get('github')
  @UseGuards(AuthGuard('github'))
  async githubAuth(@Req() req: any) {}

  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  async githubAuthCallback(
    @Req() req: any,
    @Res({ passthrough: true }) res: any,
  ) {
    const user = req.user;
    const token = await this.authService.socialLogin(user);

    res.cookie('access_token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000, //1day
    });
    res.redirect('http://localhost:3000/dashboard');
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('2fa/generate')
  async generate2FASecret(@Req() req: any) {
    const user = req.user;
    const secret = this.twoFaService.generateSecret(user.email);
    await this.userService.setTwoFASecret(user.id, secret.base32);
    if (!secret.otpauth_url) throw new Error('OTP Auth URL is missing.');
    const qrCode = await this.twoFaService.generateQRCode(secret.otpauth_url);
    return { qrCode, secret: secret.base32 };
  }

  @UseGuards(TwoFaGuard)
  @Post('2fa/verify')
  async verify2FACode(
    @Req() req: any,
    @Body('code') code: string,
    @Res({ passthrough: true }) res: any,
  ) {
    const user = await this.userService.findUserById(+req.user.id);
    if (!user || !user.twoFASecret) {
      throw new UnauthorizedException('2FA not set up for this user!');
    }
    const verified = this.twoFaService.verifyCode(user.twoFASecret, code);
    if (!verified) {
      throw new UnauthorizedException('Invalid 2FA Code');
    }
    const payload = { id: user.id, email: user.email };
    const token = this.authService.generateJwtToken(payload);
    res.cookie('access_token', token, {
      httpOnly: true, //make cookie unaccessible to JS
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/', //Cookie path
      maxAge: 24 * 60 * 60 * 1000, //1 day
    });
    //Clear pending cookie after verifying successfully
    res.clearCookie('pending_user', {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });
    return { message: '2FA verification successfully.', success: true };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('2fa/enable')
  async enable2FA(@Req() req: any, @Body('code') code: string) {
    const user = await this.userService.findUserById(req.user.id);
    if (!user || !user.twoFASecret) {
      throw new UnauthorizedException('2FA not set up for this user.');
    }
    const verified = this.twoFaService.verifyCode(user.twoFASecret, code);
    if (!verified) {
      throw new UnauthorizedException('Invalid 2FA Code.');
    }
    await this.userService.enable2FA(user.id);
    return { message: '2FA enable successfully.', success: true };
  }
}
