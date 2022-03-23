import { Book } from 'src/books/entities/book.entity';
import { Transaction } from 'src/transactions/entities/transaction.entity';
import {
  Entity,
  Column,
  OneToMany,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity()
export class Wallet {
  @PrimaryColumn()
  id: string;

  @Column()
  title: string;

  @Column()
  address: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @OneToMany(() => Book, (book) => book.wallet)
  books: Book[];

  @OneToMany(() => Transaction, (transaction) => transaction.wallet)
  transactions: Transaction[];
}
