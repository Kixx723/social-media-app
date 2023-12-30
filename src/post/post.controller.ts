import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PostService } from './post.service';
import { JwtGuard } from 'src/auth/Guard';
import { GetUser } from 'src/auth/decorator';
import { CreatePostDto, EditPostDto } from './dto';
import { ok } from 'assert';

@UseGuards(JwtGuard)
@Controller('posts')
export class PostController {
  constructor(private postService: PostService) {}

  @Get('/user-posts')
  getPostsOfUser(@GetUser('id') userId: number) {
    return this.postService.getPostsOfUser(userId);
  }

  @Get()
  getPosts() {
    return this.postService.getPosts();
  }

  // pwede sad @Param('id') postId: string pero dapat naka in ani ang getPostById(+postId) it means convert postId to int/number
  @Get(':id')
  getPostById(@Param('id', ParseIntPipe) postId: number) {
    return this.postService.getPostById(postId);
  }

  @Post()
  createPost(@GetUser('id') userId: number, @Body() dto: CreatePostDto) {
    return this.postService.createPost(userId, dto);
  }

  @Patch(':id')
  editPostById(@GetUser('id') userId: number, @Param('id', ParseIntPipe) postId: number,@Body() dto: EditPostDto) {
    return this.postService.editPostById(userId, postId, dto);
  }
  
  // PWEDE SAD NI NA METHOD NA GAMITON ANG Request() method tapos kwaon ang userId 
  // @Patch(':id')
  // editPostById(@Request() req, @Param('id', ParseIntPipe) postId: number,@Body() dto: EditPostDto) {
  //   const userId = req.user.id;
  //   return this.postService.editPostById(userId, postId, dto);
  // }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deletePostById(@Request() req, @Param('id', ParseIntPipe) postId: number) {
    const userId = req.user.id;
    return this.postService.deletePostById(userId, postId);
  }
}
