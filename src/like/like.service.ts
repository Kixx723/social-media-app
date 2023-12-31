import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LikeService {
  constructor(private prisma: PrismaService) {}

  async createLike(postId: number, userId: number) {
    // find the post
    const post = await this.prisma.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        likes: true,
      },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const existingLike = post.likes.find((like) => like.userId === userId);

    if (existingLike) {
      throw new ConflictException('User is already like the post');
    }

    const like = await this.prisma.like.create({
      data: {
        postId: postId,
        userId: userId,
      },
    });

    return like;
  }

  async deleteLikeById(likeId: number, userId: number) {
    // find the like
    const like = await this.prisma.like.findUnique({
      where: {
        id: likeId,
        userId: userId,
      },
    });
    if (!like) {
      throw new NotFoundException('No like found');
    }
    // check if user the owns the like
    if (like.userId !== userId) {
      throw new ForbiddenException('Access to resources denied');
    }

    await this.prisma.like.delete({
      where: {
        id: likeId,
      },
    });
  }
}
