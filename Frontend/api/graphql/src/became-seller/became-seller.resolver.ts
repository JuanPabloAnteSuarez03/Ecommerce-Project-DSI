import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BecameSellerService } from './became-seller.service';
import { GetBecomeSellerArgs } from './dto/get-became-seller.args';
import { BecomeSellerWithCommissionInput } from './dto/update-became-seller.input';
import { BecomeSellerWithCommission } from './entities/became-seller.entity';

@Resolver(() => BecomeSellerWithCommission)
export class BecameSellerResolver {
  constructor(private readonly becameSellerService: BecameSellerService) {}

  @Query(() => BecomeSellerWithCommission, { name: 'becameSeller' })
  findAll(@Args() getBecomeSellerArgs: GetBecomeSellerArgs) {
    return this.becameSellerService.getBecameSeller();
  }

  @Mutation(() => BecomeSellerWithCommission)
  updateBecameSeller(
    @Args('input')
    becomeSellerWithCommissionInput: BecomeSellerWithCommissionInput,
  ) {
    return this.becameSellerService.updateBecomeSeller(
      becomeSellerWithCommissionInput,
    );
  }
}
