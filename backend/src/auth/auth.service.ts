import { JwtService } from '@nestjs/jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { LoginDTO } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}
  async register(data: CreateUserDTO) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    data.password = hashedPassword;
    const user = await this.userService.createUser(data);
    return this.jwtService.sign({ id: user.id, email: user.email });
  }

  async login(loginDto: LoginDTO) {
    const user = await this.userService.findUserByEmail(loginDto.email);
    if (!user || !(await bcrypt.compare(loginDto.password, user.password)))
      throw new UnauthorizedException('Invalid Credentials!');
    return this.jwtService.sign({ id: user.id, email: user.email });
  }

  async socialLogin(userData: {
    email: string;
    name: string;
    provider: string;
  }) {
    let user = await this.userService.findUserByEmail(userData.email);
    if (!user) {
      user = await this.userService.createUser({
        email: userData.email,
        firstName: userData.name,
        lastName: '',
        password: '',
      });
    }
    return this.jwtService.sign({ id: user.id, email: user.email });
  }
}
