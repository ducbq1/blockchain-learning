import { Wallet } from 'src/wallets/entities/wallet.entity';
import {
  Entity,
  Column,
  OneToOne,
  JoinColumn,
  PrimaryColumn,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Identify } from '../../identifies/entities/identify.entity';

@Entity()
export class Book {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column({ default: true })
  type: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @ManyToOne(() => Wallet, (wallet) => wallet.books)
  wallet: Wallet;
}
