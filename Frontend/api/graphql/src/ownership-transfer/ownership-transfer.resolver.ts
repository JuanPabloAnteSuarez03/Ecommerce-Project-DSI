import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GetOwnershipTransferArgs } from './dto/get-ownership-transfer.args';
import {
  GetOwnershipTransfersArgs,
  OwnershipTransferPaginator,
} from './dto/get-ownership-transfers.args';
import { UpdateOwnershipTransferInput } from './dto/update-ownership-transfer.input';
import { OwnershipTransfer } from './entities/ownership-transfer.entity';
import { OwnershipTransferService } from './ownership-transfer.service';

@Resolver(() => OwnershipTransfer)
export class OwnershipTransferResolver {
  constructor(
    private readonly ownershipTransferService: OwnershipTransferService,
  ) {}

  @Query(() => OwnershipTransferPaginator, { name: 'ownershipTransfers' })
  async getOwnershipTransfer(
    @Args() getOwnershipTransfersArgs: GetOwnershipTransfersArgs,
  ): Promise<OwnershipTransferPaginator> {
    return this.ownershipTransferService.getOwnershipTransfer(
      getOwnershipTransfersArgs,
    );
  }

  @Query(() => OwnershipTransfer, { name: 'ownershipTransfer' })
  async getOwnershipTransferById(
    @Args() getOwnershipTransferArgs: GetOwnershipTransferArgs,
  ): Promise<OwnershipTransfer> {
    return this.ownershipTransferService.getOwnershipTransferById(
      getOwnershipTransferArgs,
    );
  }

  @Mutation(() => OwnershipTransfer)
  updateOwnershipTransfer(
    @Args('input') updateOwnershipTransferInput: UpdateOwnershipTransferInput,
  ) {
    return this.ownershipTransferService.update(
      updateOwnershipTransferInput.id,
      updateOwnershipTransferInput,
    );
  }

  @Mutation(() => OwnershipTransfer)
  deleteOwnershipTransfer(@Args('id', { type: () => ID }) id: number) {
    return this.ownershipTransferService.remove(id);
  }
}
