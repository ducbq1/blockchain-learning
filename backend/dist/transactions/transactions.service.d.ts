import { Wallet } from 'src/wallets/entities/wallet.entity';
import { Repository, UpdateResult } from 'typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Transaction } from './entities/transaction.entity';
export declare class TransactionsService {
    private walletsRepository;
    private transactionsRepository;
    constructor(walletsRepository: Repository<Wallet>, transactionsRepository: Repository<Transaction>);
    create(createTransacionDto: CreateTransactionDto): Promise<Transaction>;
    update(updateTransactionDto: UpdateTransactionDto): Promise<UpdateResult>;
    findAll(address: string): Promise<Transaction[]>;
    remove(id: number): string;
}
