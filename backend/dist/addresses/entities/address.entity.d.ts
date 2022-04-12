import { Transaction } from 'src/transactions/entities/transaction.entity';
import { Wallet } from 'src/wallets/entities/wallet.entity';
export declare class Address {
    id: string;
    address: string;
    signature: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    transaction: Transaction;
    wallet: Wallet;
}
