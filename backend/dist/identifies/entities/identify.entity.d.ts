import { Address } from '../../addresses/entities/address.entity';
export declare class Identify {
    id: string;
    title: string;
    message: string;
    balance: number;
    combineId: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    addresses: Address[];
}
