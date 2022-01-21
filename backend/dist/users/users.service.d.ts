import { Identify } from 'src/identifies/entities/identify.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Users } from './interfaces/users.interface';
export declare class UsersService implements Users {
    private readonly usersRepository;
    private readonly identifiesRepository;
    constructor(usersRepository: Repository<User>, identifiesRepository: Repository<Identify>);
    findAll(): Promise<User[]>;
    findIdentify(id: string): Promise<Identify>;
    findOne(id: string): Promise<User>;
    delete(id: string): Promise<DeleteResult>;
    softDelete(id: string): Promise<UpdateResult>;
    restore(id: string): Promise<UpdateResult>;
    create(createUserDto: CreateUserDto): Promise<User>;
    update(updateUserDto: UpdateUserDto): Promise<UpdateResult>;
}
