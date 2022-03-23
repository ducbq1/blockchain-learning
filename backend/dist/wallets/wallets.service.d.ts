import { Repository } from 'typeorm';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { Wallet } from './entities/wallet.entity';
export declare class WalletsService {
    private walletsRepository;
    constructor(walletsRepository: Repository<Wallet>);
    create(createWalletDto: CreateWalletDto): Promise<CreateWalletDto>;
    findAll(): Promise<Wallet[]>;
    findOne(id: number): string;
    update(id: number, updateWalletDto: UpdateWalletDto): string;
    remove(id: number): string;
}
