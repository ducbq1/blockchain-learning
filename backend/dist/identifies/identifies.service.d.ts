import { Identify } from './entities/identify.entity';
import { CreateIdentifyDto } from './dto/create-identify.dto';
import { UpdateIdentifyDto } from './dto/update-identify.dto';
import { CreateAddressDto } from '../addresses/dto/create-address.dto';
import { DeleteResult, InsertResult, Repository, UpdateResult } from 'typeorm';
import { Address } from 'src/addresses/entities/address.entity';
import { Identifies } from './interfaces/identifies.interface';
import { User } from 'src/users/entities/user.entity';
export declare class IdentifiesService implements Identifies {
    private idenfifiesRepository;
    private readonly addressesRepository;
    private readonly usersRepository;
    constructor(idenfifiesRepository: Repository<Identify>, addressesRepository: Repository<Address>, usersRepository: Repository<User>);
    findAll(): Promise<Identify[]>;
    findAddresses(id: string): Promise<Address[]>;
    insertAddresses(combineId: number, createAddressDto: CreateAddressDto): Promise<InsertResult>;
    findOne(id: string): Promise<Identify>;
    delete(id: string): Promise<DeleteResult>;
    softDelete(id: string): Promise<UpdateResult>;
    restore(id: string): Promise<UpdateResult>;
    update(updateIdentifyDto: UpdateIdentifyDto): Promise<UpdateResult>;
    create(createIdentifyDto: CreateIdentifyDto): Promise<CreateIdentifyDto>;
    insert(createIdentifyDto: CreateIdentifyDto): Promise<InsertResult>;
}
