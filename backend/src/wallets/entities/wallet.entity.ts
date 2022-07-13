import { Address } from 'src/addresses/entities/address.entity';
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

  @Column({ default: '' })
  address: string;

  @Column({ default: false })
  isIdentified: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @OneToMany(() => Transaction, (transaction) => transaction.wallet)
  transactions: Transaction[];

  @OneToMany(() => Address, (address) => address.wallet)
  addresses: Address[];
}
