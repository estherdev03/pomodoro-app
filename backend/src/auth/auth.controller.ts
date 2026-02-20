import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { LoginDTO } from './dto/login.dto';
import { UsersService } from 'src/users/users.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
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
  ): Promise<{ message: string }> {
    const token = await this.authService.login(loginDto);
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
}
