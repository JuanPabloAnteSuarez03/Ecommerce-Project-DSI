import { InputType, OmitType } from '@nestjs/graphql';
import { BecomeSellerWithCommission } from '../entities/became-seller.entity';

@InputType()
export class CreateBecomeSellerInput extends OmitType(
  BecomeSellerWithCommission,
  [],
) {}
