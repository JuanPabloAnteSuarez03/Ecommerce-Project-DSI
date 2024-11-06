import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import Fuse from 'fuse.js';
import { paginate } from '../common/pagination/paginate';
import { GetOwnershipTransferArgs } from './dto/get-ownership-transfer.args';
import {
  GetOwnershipTransfersArgs,
  OwnershipTransferPaginator,
} from './dto/get-ownership-transfers.args';
import { UpdateOwnershipTransferInput } from './dto/update-ownership-transfer.input';
import { OwnershipTransfer } from './entities/ownership-transfer.entity';
import ownershipTransferJson from './ownership-transfer.json';

const ownershipTransfer = plainToClass(
  OwnershipTransfer,
  ownershipTransferJson,
);

const options = {
  keys: ['name'],
  threshold: 0.3,
};

const fuse = new Fuse(ownershipTransfer, options);

@Injectable()
export class OwnershipTransferService {
  private ownershipTransfer: OwnershipTransfer[] = ownershipTransfer;

  async getOwnershipTransfer({
    text,
    first,
    page,
    language,
    search,
    orderBy,
    sortedBy,
    searchJoin,
    type,
  }: GetOwnershipTransfersArgs): Promise<OwnershipTransferPaginator> {
    const startIndex = (page - 1) * first;
    const endIndex = page * first;
    let data: OwnershipTransfer[] = this.ownershipTransfer;

    if (text?.replace(/%/g, '')) {
      const formatText = text?.replace(/%/g, '');
      data = fuse.search(formatText)?.map(({ item }) => item);
    }

    const results = data.slice(startIndex, endIndex);

    return {
      data: results,
      paginatorInfo: paginate(data.length, page, first, results.length),
    };
  }

  getOwnershipTransferById({
    transaction_identifier,
  }: GetOwnershipTransferArgs): OwnershipTransfer {
    if (transaction_identifier) {
      return this.ownershipTransfer.find(
        (p) => p.transaction_identifier === transaction_identifier,
      );
    }
    return this.ownershipTransfer[0];
  }

  findOne(id: number) {
    return `This action returns a #${id} Ownership Transfer`;
  }

  update(
    id: number,
    updateOwnershipTransferInput: UpdateOwnershipTransferInput,
  ) {
    const ownershipTransfer = this.ownershipTransfer.find(
      (p) => p.id === Number(id),
    );

    return this.ownershipTransfer[0];
  }

  remove(id: number) {
    return this.ownershipTransfer[0];
  }
}
