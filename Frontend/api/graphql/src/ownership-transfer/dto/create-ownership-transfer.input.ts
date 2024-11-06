import { InputType, OmitType } from '@nestjs/graphql';
import { OwnershipTransfer } from '../entities/ownership-transfer.entity';

@InputType()
export class CreateOwnershipTransferInput extends OmitType(OwnershipTransfer, [
  'created_at',
]) {}
