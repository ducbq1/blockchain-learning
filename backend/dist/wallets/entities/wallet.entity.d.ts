import { Address } from 'src/addresses/entities/address.entity';
import { Transaction } from 'src/transactions/entities/transaction.entity';
export declare class Wallet {
    id: string;
    title: string;
    address: string;
    isIdentified: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    transactions: Transaction[];
    addresses: Address[];
}
