import { Type } from 'class-transformer';
import { Attachment } from 'src/common/entities/attachment.entity';
import { CoreEntity } from 'src/common/entities/core.entity';

export class BecomeSeller extends CoreEntity {
  page_options: {
    page_options: BecomeSellerOptions;
  };
  language: string;
  missions: CommissionItem[];
}

export class BecomeSellerOptions {
  banner: Attachment;
  sellingStepsTitle: string;
  sellingStepsDescription: string;
  sellingStepsItem: SellingStepItem[];
  purposeTitle: string;
  purposeDescription: string;
  purposeItems: BusinessPurposeItem[];
  commissionTitle: string;
  commissionDescription: string;
  faqTitle: string;
  faqDescription: string;
  faqItems: FaqItems[];
}
export class SellingStepItem {
  id?: string;
  description: string;
  title: string;
  image?: Attachment;
}
export class BusinessPurposeItem {
  id?: string;
  description: string;
  title: string;
  icon: {
    value: string;
  };
}
export class FaqItems {
  description: string;
  title: string;
}

export interface CommissionItem {
  id?: string;
  level: string;
  sub_level: string;
  description: string;
  min_balance: number;
  max_balance: number;
  commission: number;
  image: Attachment;
}
