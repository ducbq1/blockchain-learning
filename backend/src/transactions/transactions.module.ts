import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { Wallet } from 'src/wallets/entities/wallet.entity';
import { Transaction } from './entities/transaction.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, Wallet])],
  controllers: [TransactionsController],
  providers: [TransactionsService],
})
export class TransactionsModule {}
