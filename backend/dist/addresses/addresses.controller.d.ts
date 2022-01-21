import { AddressesService } from './addresses.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
export declare class AddressesController {
    private readonly addressesService;
    constructor(addressesService: AddressesService);
    findAll(sort: boolean): Promise<import("./entities/address.entity").Address[]>;
    findOne(uuid: string): Promise<import("./entities/address.entity").Address>;
    findIdentify(address: string): Promise<import("../identifies/entities/identify.entity").Identify[]>;
    create(createAddressDto: CreateAddressDto): Promise<import("./entities/address.entity").Address>;
    restore(uuid: string): Promise<import("typeorm").UpdateResult>;
    updateStatus(payload: {
        id: string;
        isVerify: boolean;
    }): Promise<import("typeorm").UpdateResult>;
    remove(uuid: string): Promise<import("typeorm").UpdateResult>;
    update(updateAddressDto: UpdateAddressDto): Promise<import("typeorm").UpdateResult>;
}
