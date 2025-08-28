import type {
  Company,
  CompanyAddress,
  CompanyLocation,
  Maybe,
} from '@shopify/hydrogen/customer-account-api-types';

export type CustomerCompanyLocation = Pick<CompanyLocation, 'name' | 'id'> & {
  shippingAddress?:
    | Maybe<Pick<CompanyAddress, 'countryCode' | 'formattedAddress'>>
    | undefined;
};

export type CustomerCompanyLocationConnection = {
  node: CustomerCompanyLocation;
};

export type CustomerCompany =
  | Maybe<
      Pick<Company, 'name' | 'id'> & {
        locations: {
          edges: CustomerCompanyLocationConnection[];
        };
      }
    >
  | undefined;

export type B2BLocationContextValue = {
  company?: CustomerCompany;
  companyLocationId?: string;
};
