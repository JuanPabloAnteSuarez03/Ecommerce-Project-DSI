import { ArgsType, Field, ID, Int } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@ArgsType()
export class GetUserPermissionArgs {
  search?: string;
  orderBy?: string;
  sortedBy?: string;
  permission?: string;
  is_active?: boolean;
  @Field(() => Int)
  first?: number;
  @Field(() => Int)
  page?: number;
  shop_id?: string;
  exclude?: string;
  searchJoin?: string;
}
