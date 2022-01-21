import { Identify } from 'src/identifies/entities/identify.entity';
import { DeleteResult, UpdateResult } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entities/user.entity';

export interface Users {
  findAll(): Promise<User[]>;

  findOne(id: string): Promise<User>;

  create(createUserDto: CreateUserDto): Promise<User>;

  update(updateUserDto: UpdateUserDto): Promise<UpdateResult>;

  findIdentify(id: string): Promise<Identify>;

  delete(id: string): Promise<DeleteResult>;

  softDelete(id: string): Promise<UpdateResult>;

  restore(id: string): Promise<UpdateResult>;
}
