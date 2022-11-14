import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './models/user.model';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private userModel: typeof User) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      return await this.userModel.create(createUserDto);
    } catch (err) {
      throw new HttpException(
        `Internal server error. Error: ${err}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getUserByUserName(userName: string): Promise<User> {
    try {
      return await this.userModel.findOne({ where: { userName } });
    } catch (err) {
      throw new HttpException(
        `Internal server error. Error: ${err}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
