import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
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
  async login(@Body() loginDto: LoginDTO): Promise<{ token: string }> {
    const token = await this.authService.login(loginDto);
    return { token };
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
