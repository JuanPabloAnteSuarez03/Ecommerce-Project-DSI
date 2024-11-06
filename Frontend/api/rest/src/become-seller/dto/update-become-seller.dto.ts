import { PartialType } from '@nestjs/mapped-types';
import { CreateBecomeSellerDto } from './create-become-seller.dto';

export class UpdateBecomeSellerDto extends PartialType(CreateBecomeSellerDto) {}
