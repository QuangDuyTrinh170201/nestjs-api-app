import { Controller, Get, UseGuards } from '@nestjs/common';
// import { AuthGuard } from '@nestjs/passport';
// import { Request } from 'express';
import { MyJwtGuard } from '../auth/guard';
import { GetUser } from '../auth/decorator';
import { User } from '@prisma/client';

@Controller('users')
export class UserController {
  @Get('me')
  //   @UseGuards(AuthGuard('jwt'))
  @UseGuards(MyJwtGuard)
  me(@GetUser() user: User) {
    return user;
    //now create a custome guard
  }
}
