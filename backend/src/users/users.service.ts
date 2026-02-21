import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDTO } from 'src/auth/dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async createUser(data: CreateUserDTO): Promise<User> {
    const newUser = this.userRepository.create(data);
    return await this.userRepository.save(newUser);
  }
  async findUserByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: {
        email,
      },
    });
  }
  async findUserById(id: number): Promise<User | null> {
    return await this.userRepository.findOne({
      where: {
        id,
      },
    });
  }

  async setTwoFASecret(id: number, secret: string) {
    return await this.userRepository.update({ id }, { twoFASecret: secret });
  }

  async enable2FA(id: number) {
    return await this.userRepository.update({ id }, { twoFAEnabled: true });
  }
}
