import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wallet } from 'src/wallets/entities/wallet.entity';
import { Repository, UpdateResult } from 'typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Transaction } from './entities/transaction.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Wallet)
    private walletsRepository: Repository<Wallet>,
    @InjectRepository(Transaction)
    private transactionsRepository: Repository<Transaction>,
  ) {}

  async create(
    createTransacionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    const walletInstance = await this.walletsRepository.findOne({
      where: {
        address: createTransacionDto.address,
      },
    });

    const transaction = this.transactionsRepository.create(createTransacionDto);
    transaction.wallet = walletInstance;
    return await this.transactionsRepository.save(transaction);
  }

  async update(
    updateTransactionDto: UpdateTransactionDto,
  ): Promise<UpdateResult> {
    return await this.transactionsRepository.update(
      updateTransactionDto.id,
      updateTransactionDto,
    );
  }

  // findAll(): Promise<Transaction[]> {
  //   return this.transactionsRepository.find();
  // }

  async findAll(address: string): Promise<Transaction[]> {
    const walletInstance = await this.walletsRepository.findOne({
      where: {
        address: address,
      },
      relations: ['transactions'],
    });
    return walletInstance.transactions;
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }
}
