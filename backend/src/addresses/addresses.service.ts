import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from 'src/transactions/entities/transaction.entity';
import { Wallet } from 'src/wallets/entities/wallet.entity';
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
    @InjectRepository(Transaction)
    private readonly transactionsRepository: Repository<Transaction>,
    @InjectRepository(Wallet)
    private readonly walletsRepository: Repository<Wallet>,
  ) {}
  findAll(sort: boolean): Promise<Address[]> {
    throw new Error('Method not implemented.');
  }
  create(createAddressDto: CreateAddressDto): Promise<Address> {
    throw new Error('Method not implemented.');
  }
  // async findAll(sort: boolean): Promise<Address[]> {
  //   if (sort) {
  //     return this.addressesRepository.find({ order: { message: 'ASC' } });
  //   } else {
  //     return this.addressesRepository.find({ order: { message: 'DESC' } });
  //   }
  // }

  async findAllAddressTransaction(uuid: string): Promise<Address[]> {
    const transactionInstance = await this.transactionsRepository.findOne({
      where: {
        id: uuid,
      },
      relations: ['addresses'],
    });
    return transactionInstance.addresses;
  }

  async findAllAddressWallet(uuid: string): Promise<Address[]> {
    const walletInstance = await this.walletsRepository.findOne({
      where: {
        id: uuid,
        isIdentified: false,
      },
      relations: ['addresses'],
    });
    return walletInstance.addresses;
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

  async createAddressTransaction(
    createAddressDto: CreateAddressDto,
  ): Promise<Address> {
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

  async createAddressWallet(
    createAddressDto: CreateAddressDto,
  ): Promise<Address> {
    const walletInstance = await this.walletsRepository.findOne({
      where: { id: createAddressDto.walletId },
      relations: ['addresses'],
    });
    // console.log(walletInstance);
    if (
      walletInstance.addresses.some(
        (item) => item.address == createAddressDto.address,
      )
    ) {
      return new Address();
    }
    const address = this.addressesRepository.create(createAddressDto);
    address.wallet = walletInstance;

    return this.addressesRepository.save(address);
  }

  insert(createAddressDto: CreateAddressDto): Promise<InsertResult> {
    return this.addressesRepository.insert(createAddressDto);
  }
}
