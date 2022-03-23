import { Wallet } from 'src/wallets/entities/wallet.entity';
export declare class Book {
    id: string;
    name: string;
    address: string;
    type: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    wallet: Wallet;
}
