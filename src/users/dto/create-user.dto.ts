import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsOptional()
  readonly email: string;
  @IsString()
  @Length(4, 16)
  readonly password: string;
  @IsString()
  readonly userName: string;
  @IsString()
  @IsOptional()
  readonly fullName: string;
}
