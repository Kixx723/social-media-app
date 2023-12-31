import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto, EditPostDto } from './dto';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  // find all posts of specific users
  async getPostsOfUser(userId: number) {
    const userPosts = await this.prisma.post.findMany({
      where: {
        userId: userId,
      },
    });
    return userPosts;
  }

  // find all posts
  async getPosts() {
    const posts = await this.prisma.post.findMany();
    return posts;
  }

  // find post by id
  async getPostById(postId: number) {
    const post = await this.prisma.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        user: true,
        comments: {
          include: {
            user: true,
          },
        },
        likes: {
          include: {
            user: true,
          },
        },
      },
    });

    // check if the post exist
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    // calculate the comments count
    const commentsCount = post.comments.length;

    //calculate the likes count
    const likesCount = post.likes.length;

    return { ...post, commentsCount, likesCount };
  }

  async createPost(userId: number, dto: CreatePostDto) {
    const post = await this.prisma.post.create({
      data: {
        userId,
        ...dto,
      },
    });
    return post;
  }

  // edit post
  async editPostById(userId: number, postId: number, dto: EditPostDto) {
    // get the post by id
    const post = await this.prisma.post.findUnique({
      where: {
        id: postId,
        userId: userId,
      },
    });
    // check if the user owns the post
    if (!post || post.userId !== userId) {
      throw new ForbiddenException('Access to resources denied');
    }

    return this.prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        ...dto,
      },
    });
  }

  async deletePostById(userId: number, postId: number) {
    // find the post
    const post = await this.prisma.post.findUnique({
      where: {
        id: postId,
        userId: userId,
      },
    });
    // check if the user owns the post
    if (!post || post.userId !== userId) {
      throw new ForbiddenException('Access to resources denied');
    }

    await this.prisma.post.delete({
      where: {
        id: postId,
      },
    });
  }
}

//todo buhat ug logout fuctionality
