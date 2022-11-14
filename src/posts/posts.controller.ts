import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { JwtAuthGuard } from '../auth/jwt-guard/jwt-auth.guard';
import { PaginationDto } from './dto/pagination.dto';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  /**
   * API - create new post (works only with token)
   * @param createPostDto (title, content, status, userId)
   * @return object
   */
  @UseGuards(JwtAuthGuard)
  @Post()
  async createPost(@Body() createPostDto: CreatePostDto): Promise<{}> {
    return await this.postsService.createPost(createPostDto);
  }

  /**
   * API - delete post by id (works only with token)
   * @param id
   * @return object
   */
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async removePostById(@Param('id') id: number): Promise<{}> {
    return await this.postsService.removePostById(id);
  }


  /**
   * API - update post by id (works only with token)
   * @param id
   * @param createPostDto
   * @return object
   */
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async editPostById(
    @Param('id') id: number,
    @Body() createPostDto: CreatePostDto,
  ) {
    return await this.postsService.editPostById(id, createPostDto);
  }

  /**
   * API - get post by query (works only with token)
   * @param paginationDto (page, sort, userId)
   * @return []
   */
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllPosts(@Query() paginationDto: PaginationDto) {
    return await this.postsService.getAllPosts(paginationDto);
  }
}
