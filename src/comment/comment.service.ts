import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCommentDto, EditCommentDto } from './dto';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}

  async createComment(postId: number, userId: number, dto: CreateCommentDto) {
    const post = await this.prisma.post.findUnique({
      where: {
        id: postId,
        //userId: userId,
      },
    });
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return await this.prisma.comment.create({
      data: {
        postId,
        userId,
        ...dto,
      },
    });
  }

  async editCommentById(
    commentId: number,
    userId: number,
    dto: EditCommentDto,
  ) {
    // find the comment
    const comment = await this.prisma.comment.findUnique({
      where: {
        id: commentId,
      },
    });

    // check if the comment is does not exist
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    // check if the user owns the comment
    if (comment.userId !== userId) {
      throw new ForbiddenException('Access to resources denied');
    }

    const updatedComment = await this.prisma.comment.update({
      where: {
        id: commentId,
      },
      data: {
        ...dto,
      },
    });

    return updatedComment;
  }

  async deleteCommentById(commentId: number, userId: number) {
    // find the comment
    const comment = await this.prisma.comment.findUnique({
      where: {
        id: commentId,
      },
      include: {
        post: {
          include: {
            user: true,
          },
        },
      },
    });

    // check if the comment is exist
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    // check if the user owns the comment
    // check also if the user owns the post because owner of the post can delete comments
    if (comment.userId !== userId && comment.post.user.id !== userId) {
      throw new ForbiddenException('Access to resouces denied');
    }

    await this.prisma.comment.delete({
      where: {
        id: commentId,
      },
    });
  }
}
