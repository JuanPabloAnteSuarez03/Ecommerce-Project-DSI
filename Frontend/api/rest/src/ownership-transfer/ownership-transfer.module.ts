import { Module } from '@nestjs/common';
import { OwnershipTransferController } from './ownership-transfer.controller';
import { OwnershipTransferService } from './ownership-transfer.service';

@Module({
  controllers: [OwnershipTransferController],
  providers: [OwnershipTransferService],
})
export class OwnershipTransferModule {}
