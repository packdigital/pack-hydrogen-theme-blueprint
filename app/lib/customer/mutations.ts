import {fragments} from './fragments';

/*
  Access Token ——————————————————————————————————————————————————————————————————————————————————————————
*/
const ACCESS_TOKEN_CREATE = `#graphql
  mutation accessTokenCreate(
    $input: CustomerAccessTokenCreateInput!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    login: customerAccessTokenCreate(input: $input) {
      errors: customerUserErrors {
        ...CustomerUserError
      }
      customerAccessToken {
        ...CustomerAccessToken
      }
    }
  }
  ${fragments.CUSTOMER_ERROR}
  ${fragments.CUSTOMER_ACCESS_TOKEN}
`;

const ACCESS_TOKEN_RENEW = `#graphql
  mutation accessTokenRenew(
    $customerAccessToken: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    renew: customerAccessTokenRenew(customerAccessToken: $customerAccessToken) {
      errors: userErrors {
        ...UserError
      }
      customerAccessToken {
        ...CustomerAccessToken
      }
    }
  }
  ${fragments.ERROR}
  ${fragments.CUSTOMER_ACCESS_TOKEN}
`;

/*
  Address  ——————————————————————————————————————————————————————————————————————————————————————————
*/
const ADDRESS_CREATE = `#graphql
  mutation addressCreate(
    $customerAccessToken: String!
    $address: MailingAddressInput!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    create: customerAddressCreate(
      customerAccessToken: $customerAccessToken
      address: $address
    ) {
      errors: customerUserErrors {
        ...CustomerUserError
      }
      address: customerAddress {
        ...AddressFull
      }
    }
  }
  ${fragments.CUSTOMER_ERROR}
  ${fragments.ADDRESS_FULL}
`;

const ADDRESS_DELETE = `#graphql
  mutation addressDelete(
    $customerAccessToken: String!
    $id: ID!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    delete: customerAddressDelete(id: $id, customerAccessToken: $customerAccessToken) {
      errors: customerUserErrors {
        ...CustomerUserError
      }
      deletedCustomerAddressId
    }
  }
  ${fragments.CUSTOMER_ERROR}
`;

const ADDRESS_UPDATE = `#graphql
  mutation addressUpdate(
    $id: ID!
    $customerAccessToken: String!
    $address: MailingAddressInput!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    update: customerAddressUpdate(
      customerAccessToken: $customerAccessToken
      id: $id
      address: $address
    ) {
      errors: customerUserErrors {
        ...CustomerUserError
      }
      address: customerAddress {
        ...AddressFull
      }
    }
  }
  ${fragments.CUSTOMER_ERROR}
  ${fragments.ADDRESS_FULL}
`;

const ADDRESS_DEFAULT_UPDATE = `#graphql
  mutation addressDefaultUpdate(
    $customerAccessToken: String!
    $id: ID!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    default: customerDefaultAddressUpdate(
      customerAccessToken: $customerAccessToken
      addressId: $id
    ) {
      errors: customerUserErrors {
        ...CustomerUserError
      }
      customer {
        defaultAddress {
          ...AddressFull
        }
      }
    }
  }
  ${fragments.CUSTOMER_ERROR}
  ${fragments.ADDRESS_FULL}
`;

/*
  Customer  ——————————————————————————————————————————————————————————————————————————————————————————
*/
const CUSTOMER_ACTIVATE = `#graphql
  mutation customerActivate(
    $id: ID!
    $input: CustomerActivateInput!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    customerActivate(id: $id, input: $input) {
      errors: customerUserErrors {
        ...CustomerUserError
      }
      customerAccessToken {
        ...CustomerAccessToken
      }
      customer {
        ...CustomerFull
      }
    }
  }
  ${fragments.CUSTOMER_FULL}
  ${fragments.CUSTOMER_ERROR}
  ${fragments.CUSTOMER_ACCESS_TOKEN}
`;

const CUSTOMER_LOGIN = `#graphql
  mutation customerLogin(
    $input: CustomerAccessTokenCreateInput!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    login: customerAccessTokenCreate(input: $input) {
      errors: customerUserErrors {
        ...CustomerUserError
      }
      customerAccessToken {
        ...CustomerAccessToken
      }
    }
  }
  ${fragments.CUSTOMER_ERROR}
  ${fragments.CUSTOMER_ACCESS_TOKEN}
`;

const CUSTOMER_CREATE = `#graphql
  mutation customerCreate(
    $input: CustomerCreateInput!
    $country: CountryCode
    $language: LanguageCode
  )
  @inContext(country: $country, language: $language) {
    customerCreate(input: $input) {
      errors: customerUserErrors {
        ...CustomerUserError
      }
      customer {
        ...CustomerFull
      }
    }
  }
  ${fragments.CUSTOMER_FULL}
  ${fragments.CUSTOMER_ERROR}
`;

const CUSTOMER_UPDATE = `#graphql
  mutation customerUpdate(
    $customerAccessToken: String!
    $customer: CustomerUpdateInput!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    customerUpdate(customerAccessToken: $customerAccessToken, customer: $customer) {
      errors: customerUserErrors {
        ...CustomerUserError
      }
      customer {
        ...CustomerFull
      }
    }
  }
  ${fragments.CUSTOMER_FULL}
  ${fragments.CUSTOMER_ERROR}
`;

/*
  Password  ——————————————————————————————————————————————————————————————————————————————————————————
*/
const PASSWORD_RECOVER = `#graphql
  mutation passwordRecover(
    $email: String!
    $country: CountryCode
    $language: LanguageCode
  )
  @inContext(country: $country, language: $language) {
    recover: customerRecover(email: $email) {
      errors: customerUserErrors {
        ...CustomerUserError
      }
    }
  }
  ${fragments.CUSTOMER_ERROR}
`;

const PASSWORD_RESET = `#graphql
  mutation passwordReset(
    $resetUrl: URL!
    $password: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    reset: customerResetByUrl(resetUrl: $resetUrl, password: $password) {
      errors: customerUserErrors {
        ...CustomerUserError
      }
      customerAccessToken {
        ...CustomerAccessToken
      }
      customer {
        ...CustomerFull
      }
    }
  }
  ${fragments.CUSTOMER_ERROR}
  ${fragments.CUSTOMER_ACCESS_TOKEN}
  ${fragments.CUSTOMER_FULL}
`;

export const mutations = {
  ACCESS_TOKEN_CREATE,
  ACCESS_TOKEN_RENEW,

  ADDRESS_CREATE,
  ADDRESS_DELETE,
  ADDRESS_UPDATE,
  ADDRESS_DEFAULT_UPDATE,

  CUSTOMER_ACTIVATE,
  CUSTOMER_LOGIN,
  CUSTOMER_CREATE,
  CUSTOMER_UPDATE,

  PASSWORD_RECOVER,
  PASSWORD_RESET,
};
