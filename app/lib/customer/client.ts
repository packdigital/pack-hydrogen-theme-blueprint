import type {AppLoadContext} from '@shopify/remix-oxygen';
import type {
  Customer,
  CustomerAccessToken,
} from '@shopify/hydrogen/storefront-api-types';

import {queries} from './queries';
import {mutations} from './mutations';

const formatError = (error = '') => {
  let _error = error;
  _error = _error.replace(/^\[\S+\]/g, '');
  _error = _error.replace(/(- Request ID:).+$/g, '');
  _error = _error.replace(/(: {).+$/g, '');
  return _error.trim();
};

const errorsResponse = (errors: any) => {
  const _errors = Array.isArray(errors?.message)
    ? errors.message.map(formatError)
    : [formatError(errors.message)];
  return {
    errors: _errors,
    response: null,
  };
};

export const accessTokenRenewClient = async (
  context: AppLoadContext,
  {
    customerAccessToken,
  }: {
    customerAccessToken: CustomerAccessToken;
  },
) => {
  try {
    const {storefront} = context;
    const {country, language} = storefront.i18n;
    const renew = {
      response: null,
      errors: [],
      data: null,
    };

    renew.response = await storefront.mutate(mutations.ACCESS_TOKEN_RENEW, {
      variables: {customerAccessToken, country, language},
    });

    renew.errors = renew.response?.renew?.errors || [];
    renew.data = renew.response?.renew;

    const errors = renew.errors.map((error) => error?.message).filter(Boolean);

    if (errors?.length) {
      throw new Error(errors);
    }

    return {
      errors: null,
      response: renew.data,
    };
  } catch (error) {
    return errorsResponse(error);
  }
};

export const addressesClient = async (
  context: AppLoadContext,
  {
    customerAccessToken,
  }: {
    customerAccessToken: CustomerAccessToken;
  },
) => {
  try {
    const {storefront} = context;
    const {country, language} = storefront.i18n;
    const get = {
      response: null,
      errors: [],
      addresses: null,
    };

    if (!customerAccessToken?.accessToken) {
      throw new Error('customerAccessToken not provided');
    }
    // Get customer from token
    get.response = await storefront.query(queries.ADDRESSES_QUERY, {
      variables: {
        customerAccessToken: customerAccessToken.accessToken,
        country,
        language,
      },
      cache: storefront.CacheNone(),
    });

    get.errors = get.response?.errors?.length
      ? get.response.errors.map((error) => error?.message).filter(Boolean)
      : [];

    if (get.errors.length) {
      throw new Error(get.errors);
    }

    get.customer = get.response?.customer;

    const addresses = get?.customer?.addresses || [];

    return {
      errors: null,
      response: {
        addresses,
      },
    };
  } catch (error) {
    return errorsResponse(error);
  }
};

export const addressCreateClient = async (
  context: AppLoadContext,
  {
    customerAccessToken,
    address,
    isDefault,
  }: {
    customerAccessToken: CustomerAccessToken;
    address: Record<string, any>;
    isDefault?: boolean;
  },
) => {
  try {
    const {storefront} = context;
    const {country, language} = storefront.i18n;
    const created = {
      response: null,
      errors: [],
      address: null,
    };
    const defaulted = {
      response: null,
      errors: [],
      address: null,
    };

    if (!customerAccessToken || !address) {
      throw new Error('A required address create field is missing.');
    }

    // 1. create the new customer address
    created.response = await storefront.mutate(mutations.ADDRESS_CREATE, {
      variables: {
        customerAccessToken: customerAccessToken.accessToken,
        address,
        country,
        language,
      },
    });

    created.errors = created.response?.create?.errors || [];
    created.address = created.response?.create?.address || null;

    // 2. if needed set address as default
    if (isDefault) {
      defaulted.response = await storefront.mutate(
        mutations.ADDRESS_DEFAULT_UPDATE,
        {
          variables: {
            customerAccessToken: customerAccessToken.accessToken,
            id: created.address.id,
            country,
            language,
          },
        },
      );

      defaulted.address =
        defaulted?.response?.default?.customer?.defaultAddress;
      defaulted.errors = defaulted.response?.default?.errors || [];
    }

    const errors = [...created.errors, ...defaulted.errors]
      .map((error) => error?.message)
      .filter(Boolean);

    if (errors?.length) {
      throw new Error(errors);
    }

    return {
      errors: null,
      response: {
        address: created.address,
        defaultAddress: defaulted.address,
      },
    };
  } catch (error) {
    return errorsResponse(error);
  }
};

export const addressUpdateClient = async (
  context: AppLoadContext,
  {
    customerAccessToken,
    id,
    address,
    isDefault,
  }: {
    customerAccessToken: CustomerAccessToken;
    id: string;
    address: Record<string, any>;
    isDefault?: boolean;
  },
) => {
  try {
    const {storefront} = context;
    const {country, language} = storefront.i18n;
    const updated = {
      response: null,
      errors: [],
      address: null,
    };
    const defaulted = {
      response: null,
      errors: [],
      address: null,
    };

    if (
      !customerAccessToken ||
      !id ||
      !address ||
      typeof isDefault === 'undefined'
    ) {
      throw new Error('A required address update field is missing.', {
        customerAccessToken,
        id,
        address,
        isDefault,
      });
    }

    // 1. update address data
    updated.response = await storefront.mutate(mutations.ADDRESS_UPDATE, {
      variables: {
        customerAccessToken: customerAccessToken.accessToken,
        id,
        address,
        country,
        language,
      },
    });

    updated.errors = updated.response?.update?.errors || [];
    updated.address = updated.response?.update?.address;

    // 2. if needed set address as default
    if (isDefault) {
      defaulted.response = await storefront.mutate(
        mutations.ADDRESS_DEFAULT_UPDATE,
        {
          variables: {
            customerAccessToken: customerAccessToken.accessToken,
            id,
            country,
            language,
          },
        },
      );

      defaulted.address =
        defaulted?.response?.default?.customer?.defaultAddress;
      defaulted.errors = defaulted.response?.default?.errors || [];
    }

    const errors = [...updated.errors, ...defaulted.errors]
      .map((error) => error?.message)
      .filter(Boolean);

    if (errors?.length) {
      throw new Error(errors);
    }

    return {
      errors: null,
      response: {
        address: updated.address || null,
        defaultAddress: defaulted.address,
      },
    };
  } catch (error) {
    return errorsResponse(error);
  }
};

export const addressDeleteClient = async (
  context: AppLoadContext,
  {
    customerAccessToken,
    id,
  }: {
    customerAccessToken: CustomerAccessToken;
    id: string;
  },
) => {
  try {
    const {storefront} = context;
    const {country, language} = storefront.i18n;
    const deleted = {
      response: null,
      errors: [],
      addressId: null,
    };

    if (!customerAccessToken?.accessToken || !id) {
      throw new Error('Missing required customerAccessToken or id field');
    }

    // 1. delete address
    deleted.response = await storefront.mutate(mutations.ADDRESS_DELETE, {
      variables: {
        customerAccessToken: customerAccessToken.accessToken,
        id,
        country,
        language,
      },
    });

    deleted.addressId =
      deleted.response.delete.deletedCustomerAddressId || null;

    deleted.errors =
      deleted.response?.errors || deleted.response?.delete?.errors || [];

    const errors = deleted.errors
      .map((error) => error?.message)
      .filter(Boolean);

    if (errors?.length) {
      throw new Error(errors);
    }

    return {
      errors: null,
      response: {
        deletedCustomerAddressId: deleted.addressId,
      },
    };
  } catch (error) {
    return errorsResponse(error);
  }
};

export const customerActivateClient = async (
  context: AppLoadContext,
  {
    customerId,
    activationToken,
    password,
  }: {
    customerId: string;
    activationToken: string;
    password: string;
  },
) => {
  let errors: string[] = [];
  try {
    const {storefront} = context;
    const {country, language} = storefront.i18n;
    const activated = {
      response: null,
      errors: [],
      data: null,
    };

    activated.response = await storefront.mutate(mutations.CUSTOMER_ACTIVATE, {
      variables: {
        id: `gid://shopify/Customer/${customerId}`,
        input: {
          activationToken,
          password,
        },
        country,
        language,
      },
    });

    activated.errors = activated.response?.errors || [];

    if (activated.errors?.length) {
      errors = activated.errors.map((error) => error?.message).filter(Boolean);
    }

    if (activated.response?.customerActivate?.errors?.length) {
      errors = [
        ...errors,
        ...(activated.response?.customerActivate?.errors
          ?.map((error) => error?.message)
          .filter(Boolean) || []),
      ];
    }

    if (errors?.length) {
      throw new Error(errors);
    }

    activated.data = activated.response?.customerActivate;
    delete activated.data.errors;

    return {
      errors: null,
      response: activated.data,
    };
  } catch (error) {
    return errorsResponse(error);
  }
};

export const customerGetClient = async (
  context: AppLoadContext,
  {
    customerAccessToken,
  }: {
    customerAccessToken: CustomerAccessToken;
  },
) => {
  try {
    const {storefront} = context;
    const {country, language} = storefront.i18n;
    const get = {
      response: null,
      errors: [],
      customer: null,
    };

    if (!customerAccessToken?.accessToken) {
      throw new Error('customerAccessToken not provided');
    }

    // Get customer from token
    get.response = await storefront.query(queries.CUSTOMER_QUERY, {
      variables: {
        customerAccessToken: customerAccessToken.accessToken,
        country,
        language,
      },
      cache: storefront.CacheNone(),
    });

    get.errors = get.response?.errors?.length
      ? get.response.errors.map((error) => error?.message).filter(Boolean)
      : [];

    if (get.errors.length) {
      throw new Error(get.errors);
    }

    get.customer = get.response?.customer || null;

    return {
      errors: null,
      response: {
        customer: get.customer,
      },
    };
  } catch (error) {
    return errorsResponse(error);
  }
};

export const customerMetafieldClient = async (
  context: AppLoadContext,
  {
    customerAccessToken,
    key,
    namespace,
  }: {
    customerAccessToken: CustomerAccessToken;
    key: string;
    namespace: string;
  },
) => {
  try {
    const {storefront} = context;
    const {country, language} = storefront.i18n;
    const get = {
      response: null,
      errors: [],
      metafield: null,
    };

    if (!customerAccessToken?.accessToken) {
      throw new Error('customerAccessToken not provided');
    }
    if (!key) {
      throw new Error('metafield key not provided');
    }
    if (!namespace) {
      throw new Error('metafield namespace not provided');
    }

    // Get customer from token
    get.response = await storefront.query(queries.METAFIELD_QUERY, {
      variables: {
        customerAccessToken: customerAccessToken.accessToken,
        key,
        namespace,
        country,
        language,
      },
      cache: storefront.CacheNone(),
    });

    get.errors = get.response?.errors?.length
      ? get.response.errors.map((error) => error?.message).filter(Boolean)
      : [];

    if (get.errors?.length) {
      throw new Error(get.errors);
    }

    get.metafield = get.response?.customer?.metafield || null;

    if (!get.metafield) {
      throw new Error('metafield not found');
    }

    return {
      errors: null,
      response: {
        metafield: get.metafield,
      },
    };
  } catch (error) {
    return errorsResponse(error);
  }
};

export const customerLoginClient = async (
  context: AppLoadContext,
  {
    email,
    password,
  }: {
    email: string;
    password: string;
  },
) => {
  try {
    const {storefront} = context;
    const {country, language} = storefront.i18n;
    let errors: string[] = [];
    const login = {
      response: null,
      errors: [],
      customerAccessToken: null,
    };
    const get = {
      response: null,
      errors: [],
      customer: null,
    };

    if (!email || !password) {
      throw new Error('required email or password not provided');
    }

    // 1. Login with email and pass to get an customerAccessToken
    login.response = await storefront.mutate(mutations.CUSTOMER_LOGIN, {
      variables: {input: {email, password}, country, language},
    });

    login.customerAccessToken = login.response?.login?.customerAccessToken;
    login.errors = login.response?.login?.errors || [];

    // 2. get fresh customer with token info if there was no errors
    if (!login.errors.length && login?.customerAccessToken?.accessToken) {
      get.response = await storefront.query(queries.CUSTOMER_QUERY, {
        variables: {
          customerAccessToken: login.customerAccessToken.accessToken,
          country,
          language,
        },
        cache: storefront.CacheNone(),
      });

      get.customer = get.response?.customer;
      get.errors = get.response?.errors || [];

      if (!get.customer) {
        throw new Error('customer not found');
      }
    }

    errors = [...login.errors, ...get.errors]
      .map((error) => error?.message)
      .filter(Boolean);

    if (errors?.length) {
      throw new Error(errors);
    }

    return {
      errors: null,
      response: {
        customerAccessToken: login.customerAccessToken || null,
        customer: get.customer || null,
      },
    };
  } catch (error) {
    return errorsResponse(error);
  }
};

export const customerCreateClient = async (
  context: AppLoadContext,
  {
    email,
    password,
    firstName,
    lastName,
    acceptsMarketing = false,
  }: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    acceptsMarketing?: boolean;
  },
) => {
  try {
    const {storefront} = context;
    const {country, language} = storefront.i18n;
    let errors: string[] = [];
    const created = {
      response: null,
      errors: [],
      customer: null,
    };
    const login = {
      response: null,
      errors: [],
      token: null,
    };

    if (!email || !password || !firstName || !lastName) {
      throw new Error('Missing required customerCreate field');
    }

    // 1. Create customer
    created.response = await storefront.mutate(mutations.CUSTOMER_CREATE, {
      variables: {
        input: {email, password, firstName, lastName, acceptsMarketing},
        country,
        language,
      },
    });

    created.customer = created.response?.customerCreate;
    created.errors = created.response?.customerCreate?.errors || [];

    errors = created.errors;

    if (!errors.length && created.customer) {
      // 2. login by creating an customerAccessToken
      login.response = await storefront.mutate(mutations.ACCESS_TOKEN_CREATE, {
        variables: {
          input: {
            email,
            password,
          },
          country,
          language,
        },
      });

      login.errors = login.response?.login?.errors || [];
      login.accessToken = login.response?.login;
    }

    errors = [...errors, ...login.errors]
      .map((error) => error?.message)
      .filter(Boolean);

    if (errors?.length) {
      throw new Error(errors);
    }

    const response = {
      ...created.customer,
      ...login.accessToken,
    };

    delete response.errors;

    return {
      errors: null,
      response,
    };
  } catch (error) {
    return errorsResponse(error);
  }
};

export const customerUpdateClient = async (
  context: AppLoadContext,
  {
    customerAccessToken,
    customer,
  }: {
    customerAccessToken: CustomerAccessToken;
    customer: Customer;
  },
) => {
  try {
    const {storefront} = context;
    const {country, language} = storefront.i18n;
    let errors: string[] = [];
    const updated = {
      response: null,
      errors: [],
      customer: null,
    };
    const renewed = {
      response: null,
      errors: [],
      token: null,
    };

    if (!customerAccessToken?.accessToken || !customer) {
      throw new Error('required customerAccessToken or customer not provided');
    }

    // 1. Update the customer
    updated.response = await storefront.mutate(mutations.CUSTOMER_UPDATE, {
      variables: {
        customerAccessToken: customerAccessToken.accessToken,
        customer,
        country,
        language,
      },
    });

    updated.errors = updated.response?.customerUpdate?.errors || [];
    updated.customer = updated.response?.customerUpdate?.customer;

    if (!errors.length && updated.customer) {
      // 2. renew token so we can save it
      renewed.response = await storefront.mutate(mutations.ACCESS_TOKEN_RENEW, {
        variables: {
          customerAccessToken: customerAccessToken.accessToken,
          country,
          language,
        },
      });

      renewed.errors =
        renewed.response?.renew?.errors || renewed.response?.errors || [];

      renewed.accessToken = renewed.response?.renew?.customerAccessToken;

      if (!renewed.accessToken) {
        throw new Error('could not renew updated customer token');
      }
    }

    errors = [...errors, ...renewed.errors]
      .map((error) => error?.message)
      .filter(Boolean);

    if (errors?.length) {
      throw new Error(errors);
    }

    return {
      errors: null,
      response: {
        customerAccessToken: renewed.accessToken,
        customer: updated.customer,
      },
    };
  } catch (error) {
    return errorsResponse(error);
  }
};

export const customerOrderClient = async (
  context: AppLoadContext,
  {
    customerAccessToken,
    id,
  }: {
    customerAccessToken: CustomerAccessToken;
    id: string;
  },
) => {
  try {
    const {storefront} = context;
    const {country, language} = storefront.i18n;
    const get = {
      response: null,
      errors: [],
      order: null,
    };

    if (!customerAccessToken?.accessToken) {
      throw new Error('customerAccessToken not provided');
    }

    if (!id) {
      throw new Error('order id not provided');
    }

    // Get customer from token
    get.response = await storefront.query(queries.ORDER_QUERY, {
      variables: {id, country, language},
      cache: storefront.CacheNone(),
    });

    if (!get.response?.order) {
      throw new Error(`order not found with id ${id}`);
    }

    get.order = get.response.order;

    return {
      errors: null,
      response: {
        order: get.order,
      },
    };
  } catch (error) {
    return errorsResponse(error);
  }
};

export const customerOrdersClient = async (
  context: AppLoadContext,
  {
    customerAccessToken,
    first,
    last,
    before,
    after = '',
  }: {
    customerAccessToken: CustomerAccessToken;
    first?: number;
    last?: number;
    before?: string;
    after?: string;
  },
) => {
  try {
    const {storefront} = context;
    const {country, language} = storefront.i18n;

    if (!customerAccessToken?.accessToken) {
      throw new Error('required customerAccessToken not provided');
    }
    if (!first && !last && !before) {
      throw new Error('required pagination not provided');
    }

    const variables = {
      customerAccessToken: customerAccessToken.accessToken,
      first,
      country,
      language,
    };

    if (after) {
      variables.after = after;
    }

    const response = await storefront.query(
      first ? queries.ORDERS_NEXT_QUERY : queries.ORDERS_PREVIOUS_QUERY,
      {variables, cache: storefront.CacheNone()},
    );

    const data = response?.customer?.orders;

    const pageInfo = data?.pageInfo;
    const page = data?.page;
    const orders = page.map(({order}) => order);
    const nextPage = pageInfo.hasNextPage ? page[page.length - 1].cursor : null;

    const prevPage = pageInfo.hasPreviousPage ? page[0].cursor : null;

    return {
      errors: null,
      response: {
        orders,
        after: nextPage,
        before: prevPage,
      },
    };
  } catch (error) {
    return errorsResponse(error);
  }
};

export const passwordResetClient = async (
  context: AppLoadContext,
  {
    password,
    url,
  }: {
    password: string;
    url: string;
  },
) => {
  try {
    const {storefront} = context;
    const {country, language} = storefront.i18n;
    const reset = {
      response: null,
      errors: [],
      data: null,
    };

    if (!password || !url) {
      throw new Error('required password or url not provided');
    }

    reset.response = await storefront.mutate(mutations.PASSWORD_RESET, {
      variables: {
        password,
        resetUrl: url,
        country,
        language,
      },
    });

    reset.errors = reset.response?.reset?.errors
      ? reset.response?.reset?.errors
          .map((error) => error?.message)
          .filter(Boolean)
      : [];

    if (reset.errors?.length) {
      throw new Error(reset.errors);
    }

    const response = reset.response?.reset;
    delete response.errors;

    return {
      errors: null,
      response,
    };
  } catch (error) {
    return errorsResponse(error);
  }
};

export const passwordRecoverClient = async (
  context: AppLoadContext,
  {email}: {email: string},
) => {
  try {
    const {storefront} = context;
    const {country, language} = storefront.i18n;
    const recover = {
      response: null,
      errors: [],
      data: null,
    };

    if (!email) {
      throw new Error('Missing required email field');
    }

    recover.response = await storefront.mutate(mutations.PASSWORD_RECOVER, {
      variables: {email, country, language},
    });

    recover.errors = recover?.response?.recover?.errors?.length
      ? recover.response.recover.errors
          .map((error) => error?.message)
          .filter(Boolean)
      : [];

    if (recover.errors?.length) {
      throw new Error(recover.errors);
    }

    return {
      errors: null,
      response: {
        emailSent: true,
      },
    };
  } catch (error) {
    return errorsResponse(error);
  }
};
