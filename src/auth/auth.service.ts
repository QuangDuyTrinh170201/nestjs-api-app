import { Injectable } from '@nestjs/common';
// import { User, Note } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';
import { AuthDTO } from './dto';

@Injectable({})
export class AuthService {
  constructor(private prismaService: PrismaService) {}
  async register(authDTO: AuthDTO) {
    const hashedPassword = await argon.hash(authDTO.password);
    //insert data into db
    const user = this.prismaService.user.create({
      data: {
        email: authDTO.email,
        hashedPassword: hashedPassword,
        firstName: '',
        lastName: '',
      },
    });
    return user;
  }

  login() {
    return {
      message: 'login successfully',
    };
  }
}
