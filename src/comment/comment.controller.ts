import {
  Controller,
  Post,
  Patch,
  UseGuards,
  Body,
  Request,
  Param,
  ParseIntPipe,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { JwtGuard } from 'src/auth/Guard';
import { GetUser } from 'src/auth/decorator';
import { CreateCommentDto, EditCommentDto } from './dto';

@UseGuards(JwtGuard)
@Controller('comments')
export class CommentController {
  constructor(private commentService: CommentService) {}

  @Post()
  createComment(
    @Request() req,
    @GetUser('id') userId: number,
    @Body() dto: CreateCommentDto,
  ) {
    const { postId } = req.body;
    return this.commentService.createComment(postId, userId, dto);
  }

  @Patch(':id')
  editCommentById(
    @Param('id', ParseIntPipe) commentId: number,
    @GetUser('id') userId: number,
    @Body() dto: EditCommentDto,
  ) {
    return this.commentService.editCommentById(commentId, userId, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteCommentById(
    @Param('id', ParseIntPipe) commentId: number,
    @GetUser('id') userId: number,
  ) {
    return this.commentService.deleteCommentById(commentId, userId);
  }
}
