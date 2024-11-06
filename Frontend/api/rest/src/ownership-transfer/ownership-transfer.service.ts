import { Injectable } from '@nestjs/common';
import ownershipTransferJSON from '@db/ownership-transfer.json';
import { plainToClass } from 'class-transformer';
import Fuse from 'fuse.js';
import { paginate } from 'src/common/pagination/paginate';
import { CreateOwnershipTransferDto } from './dto/create-ownership-transfer.dto';
import { OwnershipTransfer } from './entities/ownership-transfer.entity';
import { GetOwnershipTransferDto } from './dto/get-ownership-transfer.dto';
import { UpdateOwnershipTransferDto } from './dto/update-ownership-transfer.dto';

const ownershipTransfer = plainToClass(
  OwnershipTransfer,
  ownershipTransferJSON,
);
const options = {
  keys: ['name'],
  threshold: 0.3,
};
const fuse = new Fuse(ownershipTransfer, options);

@Injectable()
export class OwnershipTransferService {
  private ownershipTransfer: OwnershipTransfer[] = ownershipTransfer;

  create(createOwnershipTransferDto: CreateOwnershipTransferDto) {
    return this.ownershipTransfer[0];
  }

  findAll({ search, limit, page }: GetOwnershipTransferDto) {
    if (!page) page = 1;
    if (!limit) limit = 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    let data: OwnershipTransfer[] = this.ownershipTransfer;

    if (search) {
      const parseSearchParams = search.split(';');
      for (const searchParam of parseSearchParams) {
        const [key, value] = searchParam.split(':');
        data = fuse.search(value)?.map(({ item }) => item);
      }
    }

    let results = data.slice(startIndex, endIndex);
    if (results.length == 0) {
      results = this.ownershipTransfer.slice(0, limit);
    }
    const url = `/refund-policies?search=${search}&limit=${limit}`;
    return {
      data: results,
      ...paginate(data.length, page, limit, results.length, url),
    };
  }

  getOwnershipTransfer(param: string, language: string) {
    return this.ownershipTransfer.find((p) => p.name === param);
  }

  update(id: number, updateOwnershipTransferDto: UpdateOwnershipTransferDto) {
    return this.ownershipTransfer[0];
  }

  remove(id: number) {
    return `This action removes a #${id} Ownership Transfer`;
  }
}
