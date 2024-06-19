import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() //global service, this module is used everywhere!
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
