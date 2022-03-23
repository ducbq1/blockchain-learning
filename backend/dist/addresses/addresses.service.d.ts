import { Transaction } from 'src/transactions/entities/transaction.entity';
import { DeleteResult, InsertResult, Repository, UpdateResult } from 'typeorm';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { Address } from './entities/address.entity';
export declare class AddressesService {
    private readonly addressesRepository;
    private readonly transactionsRepository;
    constructor(addressesRepository: Repository<Address>, transactionsRepository: Repository<Transaction>);
    findAll(uuid: string): Promise<Address[]>;
    findOne(id: string): Promise<Address>;
    delete(id: string): Promise<DeleteResult>;
    softDelete(id: string): Promise<UpdateResult>;
    restore(id: string): Promise<UpdateResult>;
    update(updateAddressDto: UpdateAddressDto): Promise<UpdateResult>;
    create(createAddressDto: CreateAddressDto): Promise<Address>;
    insert(createAddressDto: CreateAddressDto): Promise<InsertResult>;
}
