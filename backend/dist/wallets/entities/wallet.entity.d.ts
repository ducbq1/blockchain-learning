import { Book } from 'src/books/entities/book.entity';
import { Transaction } from 'src/transactions/entities/transaction.entity';
export declare class Wallet {
    id: string;
    title: string;
    address: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    books: Book[];
    transactions: Transaction[];
}
