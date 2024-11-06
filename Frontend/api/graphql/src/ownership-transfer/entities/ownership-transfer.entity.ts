import { InputType, ObjectType } from '@nestjs/graphql';
import { UserAddress } from 'src/addresses/entities/address.entity';
import { Refund } from 'src/refunds/entities/refund.entity';
import { Balance, Shop, ShopSettings } from 'src/shops/entities/shop.entity';
import { User } from 'src/users/entities/user.entity';
import { Withdraw } from 'src/withdraws/entities/withdraw.entity';
import { Attachment } from '../../common/entities/attachment.entity';
import { CoreEntity } from '../../common/entities/core.entity';

@InputType('OwnershipTransferInputType', { isAbstract: true })
@ObjectType()
export class OwnershipTransfer extends CoreEntity {
  transaction_identifier?: string;
  previous_owner?: User;
  current_owner?: User;
  message?: string;
  status?: string;
  shop?: Shop;
  name?: string;
  description?: string;
  cover_image?: Attachment;
  address?: UserAddress;
  settings?: ShopSettings;
  order_info?: TodayTotalOrderByStatus;
  balance_info?: Balance;
  refund_info?: Refund[];
  withdrawal_info?: Withdraw[];
  language?: string;
}

@InputType('TodayTotalOrderByStatusInputType', { isAbstract: true })
@ObjectType()
export class TodayTotalOrderByStatus {
  pending?: number;
  processing?: number;
  complete?: number;
  cancelled?: number;
  refunded?: number;
  failed?: number;
  localFacility?: number;
  outForDelivery?: number;
}
