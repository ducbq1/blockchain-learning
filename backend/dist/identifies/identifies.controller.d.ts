import { CreateAddressDto } from 'src/addresses/dto/create-address.dto';
import { CreateIdentifyDto } from './dto/create-identify.dto';
import { UpdateIdentifyDto } from './dto/update-identify.dto';
import { IdentifiesService } from './identifies.service';
export declare class IdentifiesController {
    private readonly identifiesService;
    constructor(identifiesService: IdentifiesService);
    findAll(): Promise<import("./entities/identify.entity").Identify[]>;
    findOne(uuid: string): Promise<import("./entities/identify.entity").Identify>;
    findAddresses(uuid: string): Promise<import("../addresses/entities/address.entity").Address[]>;
    remove(uuid: string): Promise<import("typeorm").UpdateResult>;
    restore(uuid: string): Promise<import("typeorm").UpdateResult>;
    insertAddresses(combineId: number, createAddressDto: CreateAddressDto): Promise<import("typeorm").InsertResult>;
    create(createIdentifyDto: CreateIdentifyDto): Promise<CreateIdentifyDto>;
    update(updateIdentityDto: UpdateIdentifyDto): Promise<import("typeorm").UpdateResult>;
}
