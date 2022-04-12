import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
  ParseBoolPipe,
  Put,
} from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Controller('addresses')
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  // @Get()
  // findAll(@Query('sort', new ParseBoolPipe()) sort: boolean) {
  //   if (typeof sort === 'boolean') {
  //     console.log('Addresses are sorted!');
  //   }
  //   return this.addressesService.findAll(sort);
  // }

  @Get(':uuid')
  findAllAddressTransaction(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
    return this.addressesService.findAllAddressTransaction(uuid);
  }

  @Get('/wallet/:uuid')
  findAllAddressWallet(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
    return this.addressesService.findAllAddressWallet(uuid);
  }

  // @Get('identify/:address')
  // findIdentify(@Param('address') address: string) {
  //   return this.addressesService.findIdentify(address);
  // }

  @Post('/transaction')
  createAddressTransaction(@Body() createAddressDto: CreateAddressDto) {
    return this.addressesService.createAddressTransaction(createAddressDto);
  }

  @Post('/wallet')
  createAddressWallet(@Body() createAddressDto: CreateAddressDto) {
    return this.addressesService.createAddressWallet(createAddressDto);
  }

  @Patch(':uuid')
  restore(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
    return this.addressesService.restore(uuid);
  }

  // @Patch()
  // updateStatus(@Body() payload: { id: string; isVerify: boolean }) {
  //   return this.addressesService.updateStatus(payload.id, payload.isVerify);
  // }

  @Delete(':uuid')
  remove(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
    return this.addressesService.delete(uuid);
  }

  @Patch()
  update(@Body() updateAddressDto: UpdateAddressDto) {
    return this.addressesService.update(updateAddressDto);
  }
}
