import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Identify } from 'src/identifies/entities/identify.entity';
import { DeleteResult, InsertResult, Repository, UpdateResult } from 'typeorm';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { Address } from './entities/address.entity';
import { Addresses } from './interfaces/addresses.interface';

@Injectable()
export class AddressesService implements Addresses {
  constructor(
    @InjectRepository(Address)
    private readonly addressesRepository: Repository<Address>,
    @InjectRepository(Identify)
    private readonly identifiesRepository: Repository<Identify>,
  ) {}
  async findAll(sort: boolean): Promise<Address[]> {
    if (sort) {
      return this.addressesRepository.find({ order: { message: 'ASC' } });
    } else {
      return this.addressesRepository.find({ order: { message: 'DESC' } });
    }
  }

  async findIdentify(address: string): Promise<Identify[]> {
    const item = await this.addressesRepository.find({
      where: { address: address },
      relations: ['identify'],
    });
    return item.map((it) => it.identify);
  }

  async findOne(id: string): Promise<Address> {
    return this.addressesRepository.findOne(id);
  }

  async delete(id: string): Promise<DeleteResult> {
    return this.addressesRepository.delete(id);
  }

  async softDelete(id: string): Promise<UpdateResult> {
    return this.addressesRepository.softDelete(id);
  }

  async restore(id: string): Promise<UpdateResult> {
    return this.addressesRepository.restore(id);
  }

  async updateStatus(id: string, isVerify: boolean): Promise<UpdateResult> {
    return this.addressesRepository.update(id, {
      isVerify: isVerify,
    });
  }

  async update(updateAddressDto: UpdateAddressDto): Promise<UpdateResult> {
    return this.addressesRepository.update(
      updateAddressDto.id,
      updateAddressDto,
    );
  }

  async create(createAddressDto: CreateAddressDto): Promise<Address> {
    const identify = await this.identifiesRepository.findOne(
      createAddressDto.identifyId,
    );
    const address = this.addressesRepository.create(createAddressDto);
    address.identify = identify;

    return this.addressesRepository.save(address);
  }

  insert(createAddressDto: CreateAddressDto): Promise<InsertResult> {
    return this.addressesRepository.insert(createAddressDto);
  }
}
