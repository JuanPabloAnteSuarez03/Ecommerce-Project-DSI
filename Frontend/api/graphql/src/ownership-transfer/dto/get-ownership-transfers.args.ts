import { ArgsType, Field, Int, ObjectType } from '@nestjs/graphql';
import { CoreGetArguments } from 'src/common/dto/core-get-arguments.args';
import { PaginatorInfo } from 'src/common/dto/paginator-info.model';
import { OwnershipTransfer } from '../entities/ownership-transfer.entity';

@ObjectType()
export class OwnershipTransferPaginator {
  data: OwnershipTransfer[];
  paginatorInfo: PaginatorInfo;
}

@ArgsType()
export class GetOwnershipTransfersArgs extends CoreGetArguments {
  language?: string;
  search?: string;
  orderBy?: string;
  sortedBy?: string;
  searchJoin?: string;
  type?: string;
  text?: string;
  @Field(() => Int)
  first?: number = 15;
  @Field(() => Int)
  page?: number = 1;
}
