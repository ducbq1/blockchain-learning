import { Module } from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { AddressesController } from './addresses.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from './entities/address.entity';
import { Identify } from 'src/identifies/entities/identify.entity';
import { Transaction } from 'src/transactions/entities/transaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Address, Transaction])],
  controllers: [AddressesController],
  providers: [AddressesService],
})
export class AddressesModule {}
