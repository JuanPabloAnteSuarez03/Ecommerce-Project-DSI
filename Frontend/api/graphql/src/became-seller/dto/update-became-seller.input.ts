import { InputType, PartialType } from '@nestjs/graphql';
import { BecomeSellerWithCommission } from '../entities/became-seller.entity';

@InputType()
export class BecomeSellerWithCommissionInput extends PartialType(
  BecomeSellerWithCommission,
) {}
