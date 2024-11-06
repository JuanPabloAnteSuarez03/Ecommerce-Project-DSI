import { Module } from '@nestjs/common';
import { BecomeSellerController } from './become-seller.controller';
import { BecomeSellerService } from './become-seller.service';

@Module({
  controllers: [BecomeSellerController],
  providers: [BecomeSellerService],
  exports: [BecomeSellerService],
})
export class BecomeSellerModule {}
