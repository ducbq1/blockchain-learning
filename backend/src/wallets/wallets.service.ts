import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { Wallet } from './entities/wallet.entity';

@Injectable()
export class WalletsService {
  constructor(
    @InjectRepository(Wallet)
    private walletsRepository: Repository<Wallet>,
  ) {}

  async create(createWalletDto: CreateWalletDto): Promise<CreateWalletDto> {
    return await this.walletsRepository.save(createWalletDto);
  }

  findAll(): Promise<Wallet[]> {
    return this.walletsRepository.find({
      where: {
        isIdentified: true,
      },
    });
  }

  async findOne(title: string): Promise<string> {
    const walletInstance = await this.walletsRepository.findOne({
      where: {
        title: title,
        isIdentified: false,
      },
    });

    if (walletInstance == undefined) {
      return '00000000-0000-0000-0000-000000000000';
    } else {
      return walletInstance.id;
    }
  }

  async check(title: string): Promise<boolean> {
    const walletCount = await this.walletsRepository.count({
      where: {
        title: title,
        isIdentified: true,
      },
    });
    return walletCount !== 0;
  }

  async update(updateWalletDto: UpdateWalletDto): Promise<UpdateResult> {
    return this.walletsRepository.update(updateWalletDto.id, updateWalletDto);
  }

  remove(id: number) {
    return `This action removes a #${id} wallet`;
  }
}
