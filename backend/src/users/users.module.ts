import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Identify } from 'src/identifies/entities/identify.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Identify]),
  ],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
