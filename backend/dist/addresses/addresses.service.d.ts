import { Transaction } from 'src/transactions/entities/transaction.entity';
import { Wallet } from 'src/wallets/entities/wallet.entity';
import { DeleteResult, InsertResult, Repository, UpdateResult } from 'typeorm';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { Address } from './entities/address.entity';
export declare class AddressesService {
    private readonly addressesRepository;
    private readonly transactionsRepository;
    private readonly walletsRepository;
    constructor(addressesRepository: Repository<Address>, transactionsRepository: Repository<Transaction>, walletsRepository: Repository<Wallet>);
    findAllAddressTransaction(uuid: string): Promise<Address[]>;
    findAllAddressWallet(uuid: string): Promise<Address[]>;
    findOne(id: string): Promise<Address>;
    delete(id: string): Promise<DeleteResult>;
    softDelete(id: string): Promise<UpdateResult>;
    restore(id: string): Promise<UpdateResult>;
    update(updateAddressDto: UpdateAddressDto): Promise<UpdateResult>;
    createAddressTransaction(createAddressDto: CreateAddressDto): Promise<Address>;
    createAddressWallet(createAddressDto: CreateAddressDto): Promise<Address>;
    insert(createAddressDto: CreateAddressDto): Promise<InsertResult>;
}
