import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { JwtGuard } from 'src/auth/Guard';
import { GetUser } from 'src/auth/decorator';
import { UserService } from './user.service';
import { EditUserDto } from './dto/edit-user.dto';


// @UseGuards(AuthGuard('jwt')) same lang ni sila sa JwtGuard gi extrends ra siya sa JwtGuard na class para limpyo tan awon
@UseGuards(JwtGuard) // the jwt is link in to the JwtStrategy class in the extrends of PassportStrategy
@Controller('users') // kaning users makita ni siya sa route like in ani /users or short ang endpoint
export class UserController {
    constructor(private userService: UserService) {}

  @Get('me') //mahimo na ni syang users/me ang end point
  getMe(@GetUser() user: User) {
    return user
  }

  @Patch(':id')
  editUser(@GetUser('id') userId: number, @Body() dto: EditUserDto) {
    return this.userService.editUser(userId, dto);
  }

  //? pwede na siya na way para maka update ug user gamit ang parameter no need to make a GetUserDecorator
  // @Patch('edit/:id')
  // editUser(@Param('id') userId: string, @Body() dto: EditUserDto) {
  //   return this.userService.editUser(+userId, dto);
  // }
  
}
