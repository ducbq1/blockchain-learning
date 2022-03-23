import { Transaction } from 'src/transactions/entities/transaction.entity';
export declare class Address {
    id: string;
    address: string;
    signature: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    transaction: Transaction;
}
