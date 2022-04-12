import { WalletsService } from './wallets.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
export declare class WalletsController {
    private readonly walletsService;
    constructor(walletsService: WalletsService);
    create(createWalletDto: CreateWalletDto): Promise<CreateWalletDto>;
    findAll(): Promise<import("./entities/wallet.entity").Wallet[]>;
    findOne(title: string): Promise<string>;
    check(title: string): Promise<boolean>;
    update(updateWalletDto: UpdateWalletDto): Promise<import("typeorm").UpdateResult>;
    remove(id: string): string;
}
