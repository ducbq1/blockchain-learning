import { Identify } from 'src/identifies/entities/identify.entity';
import { DeleteResult, InsertResult, UpdateResult } from 'typeorm';
import { CreateAddressDto } from '../dto/create-address.dto';
import { UpdateAddressDto } from '../dto/update-address.dto';
import { Address } from '../entities/address.entity';

export interface Addresses {
  findAll(sort: boolean): Promise<Address[]>;

  findIdentify(address: string): Promise<Identify[]>;

  findOne(id: string): Promise<Address>;

  delete(id: string): Promise<DeleteResult>;

  softDelete(id: string): Promise<UpdateResult>;

  restore(id: string): Promise<UpdateResult>;

  update(updateAddressDto: UpdateAddressDto): Promise<UpdateResult>;

  create(createAddressDto: CreateAddressDto): Promise<Address>;

  insert(createAddressDto: CreateAddressDto): Promise<InsertResult>;
}
