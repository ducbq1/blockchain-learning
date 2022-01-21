import {
  Entity,
  Column,
  OneToOne,
  JoinColumn,
  PrimaryColumn,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Identify } from '../../identifies/entities/identify.entity';

@Entity()
export class User {
  // @PrimaryGeneratedColumn()
  @PrimaryColumn()
  id: string;

  @Column()
  operatingSystem: string;

  @Column()
  internetProtocol: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @OneToOne(() => Identify)
  @JoinColumn()
  identify: Identify;
}
