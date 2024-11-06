import { PickType } from '@nestjs/swagger';
import { OwnershipTransfer } from '../entities/ownership-transfer.entity';

export class CreateOwnershipTransferDto extends PickType(OwnershipTransfer, [
  'status',
]) {}
