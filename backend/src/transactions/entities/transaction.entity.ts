import { Address } from 'src/addresses/entities/address.entity';
import { Identify } from 'src/identifies/entities/identify.entity';
import { Wallet } from 'src/wallets/entities/wallet.entity';
import {
  Entity,
  Column,
  ManyToOne,
  PrimaryColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class Transaction {
  // @PrimaryGeneratedColumn()
  @PrimaryColumn()
  id: string;

  @Column()
  destination: string;

  @Column()
  value: number;

  @Column()
  data: string;

  @Column()
  nonce: number;

  // @Column()
  // signatures: string;

  @Column()
  description: string;

  @Column({ default: false })
  mined: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @ManyToOne(() => Wallet, (wallet) => wallet.transactions)
  wallet: Wallet;

  @OneToMany(() => Address, (address) => address.transaction)
  addresses: Address[];
}
