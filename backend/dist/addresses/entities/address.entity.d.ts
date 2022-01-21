import { Identify } from 'src/identifies/entities/identify.entity';
export declare class Address {
    id: string;
    message: string;
    address: string;
    infuralNetworks: string;
    signature: string;
    isVerify: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    identify: Identify;
}
