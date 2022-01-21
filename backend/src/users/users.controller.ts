import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll() {
    throw new HttpException(
      {
        status: HttpStatus.FORBIDDEN,
        error: 'You cannot find all users!',
      },
      HttpStatus.FORBIDDEN,
    );
  }

  @Get(':uuid')
  async findOne(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
    return this.usersService.findOne(uuid);
  }

  @Get('identify/:uuid')
  async findIdentify(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
    return this.usersService.findIdentify(uuid);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Delete(':uuid')
  remove(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
    return this.usersService.softDelete(uuid);
  }
}
