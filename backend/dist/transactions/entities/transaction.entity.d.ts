import { Address } from 'src/addresses/entities/address.entity';
import { Wallet } from 'src/wallets/entities/wallet.entity';
export declare class Transaction {
    id: string;
    destination: string;
    value: number;
    data: string;
    nonce: number;
    description: string;
    mined: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    wallet: Wallet;
    addresses: Address[];
}
