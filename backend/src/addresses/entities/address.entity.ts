import { Identify } from 'src/identifies/entities/identify.entity';
import { Transaction } from 'src/transactions/entities/transaction.entity';
import {
  Entity,
  Column,
  ManyToOne,
  PrimaryColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Address {
  // @PrimaryGeneratedColumn()
  @PrimaryColumn()
  id: string;

  // @Column()
  // message: string;

  @Column()
  address: string;

  // @Column()
  // infuralNetworks: string;

  @Column()
  signature: string;

  // @Column({ default: true })
  // isVerify: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @ManyToOne(() => Transaction, (transaction) => transaction.addresses)
  transaction: Transaction;
}
