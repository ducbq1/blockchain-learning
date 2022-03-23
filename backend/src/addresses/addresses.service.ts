import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Identify } from 'src/identifies/entities/identify.entity';
import { Transaction } from 'src/transactions/entities/transaction.entity';
import { DeleteResult, InsertResult, Repository, UpdateResult } from 'typeorm';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { Address } from './entities/address.entity';
import { Addresses } from './interfaces/addresses.interface';

@Injectable()
export class AddressesService {
  constructor(
    @InjectRepository(Address)
    private readonly addressesRepository: Repository<Address>,
    @InjectRepository(Transaction)
    private readonly transactionsRepository: Repository<Transaction>,
  ) {}
  // async findAll(sort: boolean): Promise<Address[]> {
  //   if (sort) {
  //     return this.addressesRepository.find({ order: { message: 'ASC' } });
  //   } else {
  //     return this.addressesRepository.find({ order: { message: 'DESC' } });
  //   }
  // }

  async findAll(uuid: string): Promise<Address[]> {
    const transactionInstance = await this.transactionsRepository.findOne({
      where: {
        id: uuid,
      },
      relations: ['addresses'],
    });
    return transactionInstance.addresses;
  }

  // async findIdentify(address: string): Promise<Identify[]> {
  //   const item = await this.addressesRepository.find({
  //     where: { address: address },
  //     relations: ['identify'],
  //   });
  //   return item.map((it) => it.identify);
  // }

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

  // async updateStatus(id: string, isVerify: boolean): Promise<UpdateResult> {
  //   return this.addressesRepository.update(id, {
  //     isVerify: isVerify,
  //   });
  // }

  async update(updateAddressDto: UpdateAddressDto): Promise<UpdateResult> {
    return this.addressesRepository.update(
      updateAddressDto.id,
      updateAddressDto,
    );
  }

  // async create(createAddressDto: CreateAddressDto): Promise<Address> {
  //   const identify = await this.identifiesRepository.findOne(
  //     createAddressDto.identifyId,
  //   );
  //   const address = this.addressesRepository.create(createAddressDto);
  //   address.identify = identify;

  //   return this.addressesRepository.save(address);
  // }

  async create(createAddressDto: CreateAddressDto): Promise<Address> {
    const transactionInstance = await this.transactionsRepository.findOne({
      where: { id: createAddressDto.transactionId },
      relations: ['addresses'],
    });
    if (
      transactionInstance.addresses.some(
        (item) => item.signature == createAddressDto.signature,
      )
    ) {
      return new Address();
    }
    const address = this.addressesRepository.create(createAddressDto);
    address.transaction = transactionInstance;

    return this.addressesRepository.save(address);
  }

  insert(createAddressDto: CreateAddressDto): Promise<InsertResult> {
    return this.addressesRepository.insert(createAddressDto);
  }
}
