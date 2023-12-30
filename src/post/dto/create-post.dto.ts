import { IsDate, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsInt()
  likesCount: number;

  @IsInt()
  commentsCount: number;
}
