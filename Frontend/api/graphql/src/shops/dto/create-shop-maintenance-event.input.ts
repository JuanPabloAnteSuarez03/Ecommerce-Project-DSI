import { Field, ID, InputType, PickType } from '@nestjs/graphql';
import { BalanceInput, Shop } from '../entities/shop.entity';



@InputType()
export class CreateShopMaintenanceEventInput {
  @Field(() => ID, { nullable: true })
  shop_id?: number;
  isShopUnderMaintenance?: boolean;
  isMaintenance?: boolean;
}