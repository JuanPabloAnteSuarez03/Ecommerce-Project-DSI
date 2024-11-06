import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';

import { OwnershipTransferService } from './ownership-transfer.service';
import { CreateOwnershipTransferDto } from './dto/create-ownership-transfer.dto';
import { GetOwnershipTransferDto } from './dto/get-ownership-transfer.dto';
import { UpdateOwnershipTransferDto } from './dto/update-ownership-transfer.dto';

@Controller('ownership-transfer')
export class OwnershipTransferController {
  constructor(private ownershipTransferService: OwnershipTransferService) {}

  @Post()
  createOwnershipTransfer(
    @Body() createOwnershipTransferDto: CreateOwnershipTransferDto,
  ) {
    return this.ownershipTransferService.create(createOwnershipTransferDto);
  }

  @Get()
  findAll(@Query() query: GetOwnershipTransferDto) {
    return this.ownershipTransferService.findAll(query);
  }

  @Get(':param')
  getOwnershipTransfer(
    @Param('param') param: string,
    @Query('language') language: string,
  ) {
    return this.ownershipTransferService.getOwnershipTransfer(param, language);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Param('language') language: string,
    @Body() updateRefundDto: UpdateOwnershipTransferDto,
  ) {
    return this.ownershipTransferService.update(+id, updateRefundDto);
  }

  @Delete(':id')
  deleteOwnershipTransfer(@Param('id') id: string) {
    return this.ownershipTransferService.remove(+id);
  }
}
