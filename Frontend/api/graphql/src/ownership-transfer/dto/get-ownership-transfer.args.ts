import { ArgsType } from '@nestjs/graphql';
import { CoreGetArguments } from 'src/common/dto/core-get-arguments.args';

@ArgsType()
export class GetOwnershipTransferArgs extends CoreGetArguments {
  language?: string;
  transaction_identifier?: string;
  request_view_type?: string;
}
