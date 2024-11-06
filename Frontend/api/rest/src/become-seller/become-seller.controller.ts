import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateBecomeSellerDto } from './dto/create-become-seller.dto';
import { BecomeSellerService } from './become-seller.service';

@Controller('became-seller')
export class BecomeSellerController {
  constructor(private readonly becomeSellerService: BecomeSellerService) {}

  @Post()
  create(@Body() createBecomeSellerDto: CreateBecomeSellerDto) {
    return this.becomeSellerService.create(createBecomeSellerDto);
  }

  @Get()
  findAll() {
    return this.becomeSellerService.findAll();
  }
}
