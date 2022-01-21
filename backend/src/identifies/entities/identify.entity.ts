import { Address } from '../../addresses/entities/address.entity';
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
export class Identify {
  // @PrimaryGeneratedColumn()
  @PrimaryColumn()
  id: string;

  @Column()
  title: string;

  @Column()
  message: string;

  @Column()
  balance: number;

  @Column()
  combineId: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @OneToMany(() => Address, (address) => address.identify)
  addresses: Address[];
}
