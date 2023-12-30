import { IsInt, IsOptional, IsString } from "class-validator";

export class EditPostDto {
    @IsString()
    @IsOptional()
    content?: string
    
    // @IsInt()
    // @IsOptional()
    // likesCount?: number;
  
    // @IsInt()
    // @IsOptional()
    // commentsCount?: number;
}