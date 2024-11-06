import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import becomeSellerJson from './become-seller.json';
import { BecomeSellerWithCommissionInput } from './dto/update-became-seller.input';
import { BecomeSellerWithCommission } from './entities/became-seller.entity';

const becameSeller = plainToClass(BecomeSellerWithCommission, becomeSellerJson);

@Injectable()
export class BecameSellerService {
  private becameSeller: BecomeSellerWithCommission = becameSeller;

  getBecameSeller() {
    return this.becameSeller;
  }

  updateBecomeSeller(
    becomeSellerWithCommissionInput: BecomeSellerWithCommissionInput,
  ) {
    return this.becameSeller;
  }
}
