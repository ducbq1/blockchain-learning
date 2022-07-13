import { DeleteResult, InsertResult, UpdateResult } from 'typeorm';
import { CreateAddressDto } from '../dto/create-address.dto';
import { UpdateAddressDto } from '../dto/update-address.dto';
import { Address } from '../entities/address.entity';
export interface Addresses {
    createAddressWallet(createAddressDto: CreateAddressDto): Promise<Address>;
    createAddressTransaction(createAddressDto: CreateAddressDto): Promise<Address>;
    findAllAddressWallet(uuid: string): Promise<Address[]>;
    findAllAddressTransaction(uuid: string): Promise<Address[]>;
    findAll(sort: boolean): Promise<Address[]>;
    findOne(id: string): Promise<Address>;
    delete(id: string): Promise<DeleteResult>;
    softDelete(id: string): Promise<UpdateResult>;
    restore(id: string): Promise<UpdateResult>;
    update(updateAddressDto: UpdateAddressDto): Promise<UpdateResult>;
    create(createAddressDto: CreateAddressDto): Promise<Address>;
    insert(createAddressDto: CreateAddressDto): Promise<InsertResult>;
}
export declare const Addresses: unique symbol;
