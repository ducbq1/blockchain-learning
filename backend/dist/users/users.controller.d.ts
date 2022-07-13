import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(): Promise<void>;
    findOne(uuid: string): Promise<import("./entities/user.entity").User>;
    findIdentify(uuid: string): Promise<any>;
    create(createUserDto: CreateUserDto): Promise<import("./entities/user.entity").User>;
    remove(uuid: string): Promise<import("typeorm").UpdateResult>;
}
