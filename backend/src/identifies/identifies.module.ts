import { Module } from '@nestjs/common';
import { IdentifiesService } from './identifies.service';
import { IdentifiesController } from './identifies.controller';
import { Identify } from './entities/identify.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from 'src/addresses/entities/address.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Identify, Address, User])],
  controllers: [IdentifiesController],
  providers: [IdentifiesService],
})
export class IdentifiesModule {}
