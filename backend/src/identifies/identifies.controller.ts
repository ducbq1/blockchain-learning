import {
  Controller,
  Get,
  Param,
  Delete,
  Post,
  Body,
  Patch,
  Put,
  ParseUUIDPipe,
  ParseIntPipe,
  HttpStatus,
} from '@nestjs/common';
import { CreateAddressDto } from 'src/addresses/dto/create-address.dto';
import { CreateIdentifyDto } from './dto/create-identify.dto';
import { UpdateIdentifyDto } from './dto/update-identify.dto';
import { IdentifiesService } from './identifies.service';

@Controller('identifies')
export class IdentifiesController {
  constructor(private readonly identifiesService: IdentifiesService) {}

  @Get()
  findAll() {
    return this.identifiesService.findAll();
  }

  @Get(':uuid')
  findOne(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
    return this.identifiesService.findOne(uuid);
  }

  // @Get('addresses/:uuid')
  // findAddresses(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
  //   return this.identifiesService.findAddresses(uuid);
  // }

  // @Delete(':uuid')
  // remove(@Param('uuid') uuid: string) {
  //   return this.identifiesService.softDelete(uuid);
  // }

  @Patch(':uuid')
  restore(@Param('uuid') uuid: string) {
    return this.identifiesService.restore(uuid);
  }

  // @Post('address/:combineId')
  // insertAddresses(
  //   @Param(
  //     'combineId',
  //     new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
  //   )
  //   combineId: number,
  //   @Body() createAddressDto: CreateAddressDto,
  // ) {
  //   return this.identifiesService.insertAddresses(combineId, createAddressDto);
  // }

  // @Post('address/:addressContract')
  // insertAddresses(
  //   @Param('addressContract') addressContract: string,
  //   @Body() createAddressDto: CreateAddressDto,
  // ) {
  //   return this.identifiesService.insertAddresses(
  //     addressContract,
  //     createAddressDto,
  //   );
  // }

  @Post()
  create(@Body() createIdentifyDto: CreateIdentifyDto) {
    return this.identifiesService.create(createIdentifyDto);
  }

  @Put()
  update(@Body() updateIdentityDto: UpdateIdentifyDto) {
    return this.identifiesService.update(updateIdentityDto);
  }
}
