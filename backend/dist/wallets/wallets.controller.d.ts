import { WalletsService } from './wallets.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
export declare class WalletsController {
    private readonly walletsService;
    constructor(walletsService: WalletsService);
    create(createWalletDto: CreateWalletDto): Promise<CreateWalletDto>;
    findAll(): Promise<import("./entities/wallet.entity").Wallet[]>;
    findOne(id: string): string;
    update(id: string, updateWalletDto: UpdateWalletDto): string;
    remove(id: string): string;
}
