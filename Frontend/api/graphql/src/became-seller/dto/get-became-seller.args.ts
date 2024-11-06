import { ArgsType } from '@nestjs/graphql';

@ArgsType()
export class GetBecomeSellerArgs {
  language?: string;
}
