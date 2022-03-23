import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
export declare class TransactionsController {
    private readonly transactionsService;
    constructor(transactionsService: TransactionsService);
    create(createTransactionDto: CreateTransactionDto): Promise<import("./entities/transaction.entity").Transaction>;
    findAll(address: string): Promise<import("./entities/transaction.entity").Transaction[]>;
    update(updateTransactionDto: UpdateTransactionDto): Promise<import("typeorm").UpdateResult>;
    remove(id: string): string;
}
