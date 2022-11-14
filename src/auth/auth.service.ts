import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
const bcrypt = require('bcryptjs');

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async registration(userDto: CreateUserDto) {
    const saltOrRounds = 10;
    let oldUser: CreateUserDto;

    //validation by userName
    try {
      oldUser = await this.userService.getUserByUserName(userDto.userName);
    } catch (err) {
      throw new HttpException(
        `Failed to get post by user name ${userDto.email}. Error: ${err}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (oldUser) {
      throw new HttpException(
        `Email ${userDto.email} already exists in the system`,
        HttpStatus.BAD_REQUEST,
      );
    }

    //hash password
    const hashPassword = await bcrypt.hash(userDto.password, saltOrRounds);

    let user: CreateUserDto;
    try {
      user = await this.userService.createUser({
        ...userDto,
        password: hashPassword,
      });
    } catch (err) {
      throw new HttpException(
        `Failed to create new user with email: ${userDto.email}. Error: ${err}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return this.generateToken(user);
  }

  async login(userDto: CreateUserDto) {
    let user: CreateUserDto;
    try {
      user = await this.validateUser(userDto);
    } catch (err) {
      throw new HttpException(
        `Failed to get user with user name: ${userDto.userName}. Error: ${err}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return this.generateToken(user);
  }

  private generateToken(userDto: CreateUserDto) {
    const payload = { email: userDto.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  private async validateUser(userDto: CreateUserDto) {
    let user: CreateUserDto;
    try {
      user = await this.userService.getUserByUserName(userDto.userName);
    } catch (err) {
      throw new HttpException(
        `Internal server error. Error: ${err}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (!user) {
      throw new UnauthorizedException({
        message: `User name ${userDto.email} doesn't exist in the system.`,
      });
    }

    //compare passwords
    const isPassEquals = await bcrypt.compare(userDto.password, user.password);

    if (!isPassEquals) {
      throw new UnauthorizedException({
        message: `Password ${userDto.password} not correct.`,
      });
    }
    return user;
  }
}
