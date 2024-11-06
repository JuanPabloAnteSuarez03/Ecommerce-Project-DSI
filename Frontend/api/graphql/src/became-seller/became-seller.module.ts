import { Module } from '@nestjs/common';
import { BecameSellerResolver } from './became-seller.resolver';
import { BecameSellerService } from './became-seller.service';

@Module({
  providers: [BecameSellerResolver, BecameSellerService],
})
export class BecameSellerModule {}
