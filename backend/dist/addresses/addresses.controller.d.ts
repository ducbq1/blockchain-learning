import { AddressesService } from './addresses.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
export declare class AddressesController {
    private readonly addressesService;
    constructor(addressesService: AddressesService);
    findAllAddressTransaction(uuid: string): Promise<import("./entities/address.entity").Address[]>;
    findAllAddressWallet(uuid: string): Promise<import("./entities/address.entity").Address[]>;
    createAddressTransaction(createAddressDto: CreateAddressDto): Promise<import("./entities/address.entity").Address>;
    createAddressWallet(createAddressDto: CreateAddressDto): Promise<import("./entities/address.entity").Address>;
    restore(uuid: string): Promise<import("typeorm").UpdateResult>;
    remove(uuid: string): Promise<import("typeorm").DeleteResult>;
    update(updateAddressDto: UpdateAddressDto): Promise<import("typeorm").UpdateResult>;
}
