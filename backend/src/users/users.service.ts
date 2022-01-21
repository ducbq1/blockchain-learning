import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Identify } from 'src/identifies/entities/identify.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Users } from './interfaces/users.interface';

@Injectable()
export class UsersService implements Users {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Identify)
    private readonly identifiesRepository: Repository<Identify>,
  ) {}

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findIdentify(id: string): Promise<Identify> {
    const item = await this.usersRepository.findOne(id, {
      relations: ['identify'],
    });
    return item.identify;
  }

  findOne(id: string): Promise<User> {
    return this.usersRepository.findOne(id);
  }

  async delete(id: string): Promise<DeleteResult> {
    return await this.usersRepository.delete(id);
  }

  async softDelete(id: string): Promise<UpdateResult> {
    return await this.usersRepository.softDelete(id);
  }

  async restore(id: string): Promise<UpdateResult> {
    return await this.usersRepository.restore(id);
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const idenfity = await this.identifiesRepository.findOne(
      createUserDto.identifyId,
    );
    const user = this.usersRepository.create(createUserDto);
    user.identify = idenfity;
    return await this.usersRepository.save(user);
  }

  async update(updateUserDto: UpdateUserDto): Promise<UpdateResult> {
    return await this.usersRepository.update(updateUserDto.id, updateUserDto);
  }
}
