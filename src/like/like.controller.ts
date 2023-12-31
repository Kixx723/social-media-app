import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/Guard';
import { LikeService } from './like.service';
import { GetUser } from 'src/auth/decorator';

@UseGuards(JwtGuard)
@Controller('likes')
export class LikeController {
  constructor(private likeService: LikeService) {}

  @Post()
  createLike(@Request() req, @GetUser('id') userId: number) {
    const { postId } = req.body;
    return this.likeService.createLike(postId, userId);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteLikeById(
    @Param('id', ParseIntPipe) likeId: number,
    @GetUser('id') userId: number,
  ) {
    return this.likeService.deleteLikeById(likeId, userId);
  }
}
