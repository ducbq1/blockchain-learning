import { Address } from 'src/addresses/entities/address.entity';
import { DeleteResult, InsertResult, UpdateResult } from 'typeorm';
import { CreateIdentifyDto } from '../dto/create-identify.dto';
import { UpdateIdentifyDto } from '../dto/update-identify.dto';
import { Identify } from '../entities/identify.entity';
export interface Identifies {
    findAll(): Promise<Identify[]>;
    findAddresses(id: string): Promise<Address[]>;
    findOne(id: string): Promise<Identify>;
    delete(id: string): Promise<DeleteResult>;
    softDelete(id: string): Promise<UpdateResult>;
    restore(id: string): Promise<UpdateResult>;
    update(updateIdentifyDto: UpdateIdentifyDto): Promise<UpdateResult>;
    create(createIdentifyDto: CreateIdentifyDto): Promise<CreateIdentifyDto>;
    insert(createIdentifyDto: CreateIdentifyDto): Promise<InsertResult>;
}
