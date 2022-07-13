import { Module } from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { AddressesController } from './addresses.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from './entities/address.entity';
import { Transaction } from 'src/transactions/entities/transaction.entity';
import { Wallet } from 'src/wallets/entities/wallet.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Address, Transaction, Wallet])],
  controllers: [AddressesController],
  providers: [AddressesService],
})
export class AddressesModule {}
