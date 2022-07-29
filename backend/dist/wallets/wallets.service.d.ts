import { Repository, UpdateResult } from 'typeorm';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { Wallet } from './entities/wallet.entity';
export declare class WalletsService {
    private walletsRepository;
    constructor(walletsRepository: Repository<Wallet>);
    create(createWalletDto: CreateWalletDto): Promise<Wallet>;
    findAll(): Promise<Wallet[]>;
    findOne(title: string): Promise<string>;
    check(title: string): Promise<boolean>;
    update(updateWalletDto: UpdateWalletDto): Promise<UpdateResult>;
    remove(id: number): string;
}
