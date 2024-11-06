import { OmitType } from '@nestjs/swagger';
import { BecomeSeller } from '../entities/become-seller.entity';

export class CreateBecomeSellerDto extends OmitType(BecomeSeller, [
  'created_at',
  'updated_at',
]) {}
