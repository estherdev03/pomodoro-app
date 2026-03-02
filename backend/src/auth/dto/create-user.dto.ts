import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDTO {
  @IsNotEmpty({ message: 'Email is required.' })
  @IsEmail({}, { message: 'Please enter a valid email address.' })
  email: string;

  @IsNotEmpty({ message: 'Password is required.' })
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters.' })
  @MaxLength(128, { message: 'Password must not exceed 128 characters.' })
  password: string;

  @IsNotEmpty({ message: 'First name is required.' })
  @IsString()
  @MinLength(1, { message: 'First name is required.' })
  @MaxLength(100, { message: 'First name must not exceed 100 characters.' })
  firstName: string;

  @IsNotEmpty({ message: 'Last name is required.' })
  @IsString()
  @MinLength(1, { message: 'Last name is required.' })
  @MaxLength(100, { message: 'Last name must not exceed 100 characters.' })
  lastName: string;
}
