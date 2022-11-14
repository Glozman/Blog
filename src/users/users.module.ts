import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './models/user.model';
import { UsersService } from './users.service';
import { Post } from '../posts/models/post.model';

@Module({
  providers: [UsersService],
  imports: [SequelizeModule.forFeature([User, Post])],
  exports: [UsersService],
})
export class UsersModule {}
