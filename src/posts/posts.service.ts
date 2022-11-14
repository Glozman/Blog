import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Post } from './models/post.model';
import { PaginationDto } from './dto/pagination.dto';

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post) private postModel: typeof Post) {}

  async createPost(createPostDto: CreatePostDto): Promise<{}> {
    let id: number;
    try {
      id = (await this.postModel.create(createPostDto))?.dataValues?.id;
    } catch (err) {
      throw new HttpException(
        `Internal server error. Error: ${err}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    if (!id) {
      throw new HttpException(
        `Failed to create new post ${createPostDto.title}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return {
      Success: true,
      Message: `Post '${createPostDto.title}' was saved successfully with id: ${id}`,
    };
  }

  async removePostById(id: number, forceDelete = false): Promise<{}> {
    let postByPk: {};
    try {
      postByPk = await this.getPostByByPk(id);
    } catch (err) {
      throw new HttpException(
        `Failed to get post by id ${id}. Error: ${err}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    if (!postByPk) {
      throw new NotFoundException({
        message: `Post with id ${id} doesn't exist`,
      });
    }

    try {
      await this.postModel.destroy({
        where: {
          id,
        },
        force: forceDelete,
      });
    } catch (err) {
      throw new HttpException(
        `Internal server error. Error: ${err}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return {
      Success: true,
      Message: `Post with id: ${id} was deleted successfully!`,
    };
  }

  async editPostById(id: number, createPostDto: CreatePostDto): Promise<{}> {
    let postByPk: {};
    try {
      postByPk = await this.getPostByByPk(id);
    } catch (err) {
      throw new HttpException(
        `Failed to get post by id ${id}. Error: ${err}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (!postByPk) {
      throw new NotFoundException({
        message: `Post with id ${id} doesn't exist`,
      });
    }

    try {
      await this.postModel.update(createPostDto, { where: { id } });
    } catch (err) {
      throw new HttpException(
        `Failed to update post by id ${id}. Error: ${err}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return {
      Success: true,
      Message: `Post '${createPostDto.title}' was updated successfully!`,
    };
  }

  private async getPostByByPk(id: number): Promise<{}> {
    try {
      return await this.postModel.findByPk(id);
    } catch (err) {
      throw new HttpException(
        `Internal server error. Error: ${err}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllPosts(pagination: PaginationDto, limit = 10): Promise<Post[]> {
    const page = pagination?.page ?? 1;
    const sort = pagination?.sort ?? 'ASC';
    const userId = pagination.userId ?? null;

    const filterBy = userId ? { userId } : {};

    try {
      return await this.postModel.findAll({
        offset: (+page - 1) * limit,
        limit,
        order: [['id', sort]],
        where: filterBy,
      });
    } catch (err) {
      throw new HttpException(
        `Internal server error. Error: ${err}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
