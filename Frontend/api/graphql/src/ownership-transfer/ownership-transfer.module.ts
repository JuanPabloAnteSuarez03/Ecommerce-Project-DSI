import { Module } from '@nestjs/common';
import { OwnershipTransferResolver } from './ownership-transfer.resolver';
import { OwnershipTransferService } from './ownership-transfer.service';

@Module({
  providers: [OwnershipTransferResolver, OwnershipTransferService],
})
export class OwnershipTransferModule {}
