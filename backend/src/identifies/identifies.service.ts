import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Identify } from './entities/identify.entity';
import { CreateIdentifyDto } from './dto/create-identify.dto';
import { UpdateIdentifyDto } from './dto/update-identify.dto';
import { CreateAddressDto } from '../addresses/dto/create-address.dto';
import { DeleteResult, InsertResult, Repository, UpdateResult } from 'typeorm';
import { Address } from 'src/addresses/entities/address.entity';
import { Identifies } from './interfaces/identifies.interface';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class IdentifiesService implements Identifies {
  constructor(
    @InjectRepository(Identify)
    private idenfifiesRepository: Repository<Identify>,
    @InjectRepository(Address)
    private readonly addressesRepository: Repository<Address>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  findAll(): Promise<Identify[]> {
    return this.idenfifiesRepository.find();
  }

  async findAddresses(id: string): Promise<Address[]> {
    const item = await this.idenfifiesRepository.findOne(id, {
      relations: ['addresses'],
    });
    return item.addresses;
  }

  async insertAddresses(
    combineId: number,
    createAddressDto: CreateAddressDto,
  ): Promise<InsertResult> {
    const identifyItem = await this.idenfifiesRepository.findOne({
      where: { combineId: combineId },
      relations: ['addresses'],
    });
    if (
      identifyItem == undefined ||
      identifyItem.addresses.some(
        (element: Address) => element.address == createAddressDto.address,
      )
    ) {
      return new InsertResult();
    }
    const address = this.addressesRepository.create(createAddressDto);
    address.identify = identifyItem;
    return await this.addressesRepository.insert(address);
  }

  findOne(id: string): Promise<Identify> {
    return this.idenfifiesRepository.findOne(id);
  }

  async delete(id: string): Promise<DeleteResult> {
    return await this.idenfifiesRepository.delete(id);
  }

  async softDelete(id: string): Promise<UpdateResult> {
    const firstItem = await this.idenfifiesRepository.findOne(id, {
      relations: ['addresses'],
    });
    await this.addressesRepository.softRemove(firstItem.addresses);
    return await this.idenfifiesRepository.softDelete(id);
  }

  async restore(id: string): Promise<UpdateResult> {
    return await this.idenfifiesRepository.restore(id);
  }

  async update(updateIdentifyDto: UpdateIdentifyDto): Promise<UpdateResult> {
    return await this.idenfifiesRepository.update(
      updateIdentifyDto.id,
      updateIdentifyDto,
    );
  }

  async create(
    createIdentifyDto: CreateIdentifyDto,
  ): Promise<CreateIdentifyDto> {
    return await this.idenfifiesRepository.save(createIdentifyDto);
  }

  async insert(createIdentifyDto: CreateIdentifyDto): Promise<InsertResult> {
    return await this.idenfifiesRepository.insert(createIdentifyDto);
  }
}
