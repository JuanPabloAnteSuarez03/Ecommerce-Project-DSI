import { InputType, ObjectType } from '@nestjs/graphql';
import { Attachment } from 'src/common/entities/attachment.entity';
import { CoreEntity } from 'src/common/entities/core.entity';

@InputType('BecomeSellerWithCommissionInput', { isAbstract: true })
@ObjectType()
export class BecomeSellerWithCommission extends CoreEntity {
  page_options?: BecameSeller;
  commissions?: CommissionItem[];
  language?: string;
}

@InputType('BecameSellerInputType', { isAbstract: true })
@ObjectType()
export class BecameSeller {
  id?: string;
  page_options?: BecameSellerOptions;
  language?: string;
  banner?: BannerType;
  faqTitle?: string;
  faqDescription?: string;
  faqItems?: CommonTitleDescription[];
  contact?: CommonTitleDescription;
  sellingStepsTitle?: string;
  sellingStepsDescription?: string;
  sellingStepsItem?: SellingStepItem[];
  guidelineTitle?: string;
  guidelineItems?: GuidelineItems[];
  commissionTitle?: string;
  commissionDescription?: string;
  purposeTitle?: string;
  purposeDescription?: string;
  purposeItems?: BusinessPurposeItem[];
  userStoryTitle?: string;
  userStoryDescription?: string;
  userStories?: UserStory[];
  sellerOpportunity?: Showcase;
  dashboard?: Showcase;
  guidelineDescription?: string;
  isMultiCommissionRate?: boolean;
  defaultCommissionRate?: number;
  defaultCommissionDetails?: string;
}

@InputType('BecameSellerOptionsInputType', { isAbstract: true })
@ObjectType()
export class BecameSellerOptions {
  banner?: BannerType;
  faqTitle?: string;
  faqDescription?: string;
  faqItems?: CommonTitleDescription[];
  contact?: CommonTitleDescription;
  sellingStepsTitle?: string;
  sellingStepsDescription?: string;
  sellingStepsItem?: SellingStepItem[];
  guidelineTitle?: string;
  guidelineItems?: GuidelineItems[];
  commissionTitle?: string;
  commissionDescription?: string;
  purposeTitle?: string;
  purposeDescription?: string;
  purposeItems?: BusinessPurposeItem[];
  userStoryTitle?: string;
  userStoryDescription?: string;
  userStories?: UserStory[];
  sellerOpportunity?: Showcase;
  dashboard?: Showcase;
  guidelineDescription?: string;
  isMultiCommissionRate?: boolean;
  defaultCommissionRate?: number;
  defaultCommissionDetails?: string;
}

@InputType('BannerTypeInputType', { isAbstract: true })
@ObjectType()
export class BannerType {
  image?: Attachment;
  title?: string;
  newsTickerTitle?: string;
  newsTickerURL?: string;
  description: string;
  button1Name?: string;
  button1Link?: string;
  button2Name?: string;
  button2Link?: string;
}

@InputType('CommonTitleDescriptionInputType', { isAbstract: true })
@ObjectType()
export class CommonTitleDescription {
  title?: string;
  description?: string;
}
@InputType('SellingStepItemInputType', { isAbstract: true })
@ObjectType()
export class SellingStepItem {
  description?: string;
  title?: string;
  image?: Attachment;
}

@InputType('GuidelineItemsInputType', { isAbstract: true })
@ObjectType()
export class GuidelineItems {
  title?: string;
  link?: string;
}
@InputType('BusinessPurposeItemInputType', { isAbstract: true })
@ObjectType()
export class BusinessPurposeItem {
  id?: string;
  description?: string;
  title: string;
  icon: IconValue;
}

@InputType('IconValueInputType', { isAbstract: true })
@ObjectType()
export class IconValue {
  value?: string;
}

@InputType('UserStoryInputType', { isAbstract: true })
@ObjectType()
export class UserStory {
  title?: string;
  description?: string;
  link?: string;
  thumbnail?: Attachment;
}

@InputType('ShowcaseInputType', { isAbstract: true })
@ObjectType()
export class Showcase {
  title?: string;
  description?: string;
  buttonName?: string;
  buttonLink?: string;
  button2Name?: string;
  button2Link?: string;
  image?: Attachment;
}

@InputType('CommissionInputType', { isAbstract: true })
@ObjectType()
export class CommissionItem {
  id?: string;
  level?: string;
  sub_level?: string;
  description?: string;
  min_balance?: number;
  max_balance?: number;
  commission?: number;
  image?: Attachment;
  language?: string;
}
