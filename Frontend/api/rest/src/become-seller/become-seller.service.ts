import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { BecomeSeller } from './entities/become-seller.entity';
import becomeSellerJson from '@db/become-seller.json';
import { CreateBecomeSellerDto } from './dto/create-become-seller.dto';
import { UpdateBecomeSellerDto } from './dto/update-become-seller.dto';

const becomeSeller = plainToClass(BecomeSeller, becomeSellerJson);

@Injectable()
export class BecomeSellerService {
  private becomeSeller: BecomeSeller = becomeSeller;

  create(createBecomeSellerDto: CreateBecomeSellerDto) {
    return this.becomeSeller;
  }

  findAll() {
    return this.becomeSeller;
  }

  findOne(id: number) {
    return `This action returns a #${id} setting`;
  }

  update(id: number, updateBecomeSellerDto: UpdateBecomeSellerDto) {
    return this.becomeSeller;
  }

  remove(id: number) {
    return `This action removes a #${id} Become Seller`;
  }
}
