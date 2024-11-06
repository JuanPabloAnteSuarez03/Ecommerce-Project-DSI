import { CoreEntity } from 'src/common/entities/core.entity';
import { Refund } from 'src/refunds/entities/refund.entity';
import { Balance, Shop } from 'src/shops/entities/shop.entity';
import { User } from 'src/users/entities/user.entity';
import { Withdraw } from 'src/withdraws/entities/withdraw.entity';

export class OwnershipTransfer extends CoreEntity {
  created_by: string;
  deleted_at: string;
  transaction_identifier: string;
  previous_owner: User;
  current_owner: User;
  message?: string;
  status: string;
  shop: Shop;
  refund_info?: Refund[];
  withdrawal_info?: Withdraw[];
  order_info: TodayTotalOrderByStatus;
  balance_info: Balance;
  name: string;
}

export class TodayTotalOrderByStatus {
  pending: number;
  processing: number;
  complete: number;
  cancelled: number;
  refunded: number;
  failed: number;
  localFacility: number;
  outForDelivery: number;
}

