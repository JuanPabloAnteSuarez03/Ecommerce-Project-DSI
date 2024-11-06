import { Field, ID, InputType, PartialType } from '@nestjs/graphql';
import { CreateOwnershipTransferInput } from './create-ownership-transfer.input';

@InputType()
export class UpdateOwnershipTransferInput extends PartialType(
  CreateOwnershipTransferInput,
) {
  @Field(() => ID)
  id: number;
}
