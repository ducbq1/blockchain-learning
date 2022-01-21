import { Identify } from '../../identifies/entities/identify.entity';
export declare class User {
    id: string;
    operatingSystem: string;
    internetProtocol: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    identify: Identify;
}
