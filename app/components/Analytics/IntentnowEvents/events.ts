export interface PageViewedEventData {}

export interface ProductViewedEventData {
  productVariant: {
    product: {
      title: string;
      vendor?: string;
      id: string;
      type?: string;
    };
    price: {
      amount: number;
      currencyCode: string;
    };
    id: string;
    title: string;
  };
}

export interface CollectionViewedEventData {
  collection: {
    id: string;
    title: string;
    handle: string;
  };
}

export interface ProductAddedToCartEventData {
  cartLine: {
    cost: {
      totalAmount: {
        amount: number;
        currencyCode: string;
      };
    };
    merchandise: {
      id: string;
      price: {
        amount: number;
        currencyCode: string;
      };
      product: {
        id: string;
        title: string;
        vendor?: string;
        type?: string;
      };
      sku?: string;
      title: string;
    };
    quantity: number;
  };
}

export interface ProductRemovedFromCartEventData {
  cartLine: {
    cost: {
      totalAmount: {
        amount: number;
        currencyCode: string;
      };
    };
    merchandise: {
      id: string;
      price: {
        amount: number;
        currencyCode: string;
      };
      product: {
        id: string;
        title: string;
        vendor?: string;
        type?: string;
      };
      sku?: string;
      title: string;
    };
    quantity: number;
  };
}

export interface SearchSubmittedEventData {
  searchResult: {
    query: string;
    productVariants: {
      price: {
        amount: number;
        currencyCode: string;
      };
      product: {
        title: string;
        vendor?: string;
        id: string;
        type?: string;
      };
      id: string;
      sku?: string;
      title: string;
    }[];
  };
}

export declare class ClickedEventData {}

export enum StoreEventName {
  page_viewed = 'page_viewed',
  product_viewed = 'product_viewed',
  product_added_to_cart = 'product_added_to_cart',
  product_removed_from_cart = 'product_removed_from_cart',
  collection_viewed = 'collection_viewed',
  search_submitted = 'search_submitted',
  clicked = 'clicked',
}

export type StoreEventData =
  | PageViewedEventData
  | ProductViewedEventData
  | ProductAddedToCartEventData
  | ProductRemovedFromCartEventData
  | CollectionViewedEventData
  | SearchSubmittedEventData
  | ClickedEventData;

export interface IntentnowTagScript {
  //Initialize the SDK. It should be called once script is loaded and before any events are sent or widget is run.
  initializeHeadless: (settings: {
    storeApiKey: string;
    myshopifyDomain: string;

    //Automatically capture dom events (e.g., "clicked")
    autoDomEvents?: boolean;
  }) => void;

  //Run the Intentnow widget
  runWidgetHeadless: (options?: {
    //Choose the root element to render the widget in. If not provided, it will be rendered in the body.
    renderRootElementId?: string;

    //A function that returns a boolean to determine if the widget should be enabled. If not provided, the widget will be enabled. You can use this to disable the widget under certain conditions.
    isEnabled?: () => boolean;
  }) => void;

  //Send events
  sendEventHeadless: (event: {
    name: string;
    data: Record<string, any>;
  }) => Promise<void>;
}

export const ANALYTICS_NAME = 'IntentnowEvents';
type Data = Record<string, any>;

async function emitEvent({
  name,
  data,
  debug,
}: {
  name: string;
  data: Record<string, any>;
  debug?: boolean;
}) {
  const intentnowTag = (window as any).IntentnowTag as
    | IntentnowTagScript
    | undefined;

  if (!intentnowTag) {
    console.error(
      `${ANALYTICS_NAME}: ❌ error: \`IntentnowTag\` is not initialized..`,
    );
    return;
  }

  debug && console.log(`${ANALYTICS_NAME}: emitEvent`, name, data);

  await intentnowTag.sendEventHeadless({
    name,
    data,
  });
}

export async function pageViewedEvent({
  data,
  debug,
}: {
  data: Data;
  debug?: boolean;
}) {
  await emitEvent({
    name: 'page_viewed',
    data: {},
    debug,
  });
}

export async function productViewedEvent({
  data,
  debug,
}: {
  data: Data;
  debug?: boolean;
}) {
  const eventData: ProductViewedEventData = {
    productVariant: {
      product: {
        title: data.customData.product.title,
        vendor: data.customData.product.vendor,
        id: data.customData.product.id,
        type: data.customData.product.productType,
      },
      price: data.customData.selectedVariant.price,
      id: data.customData.selectedVariant.id,
      title: data.customData.selectedVariant.title,
    },
  };

  await emitEvent({
    name: 'product_viewed',
    data: eventData,
    debug,
  });
}

export async function collectionViewedEvent({
  data,
  debug,
}: {
  data: Data;
  debug?: boolean;
}) {
  const eventData: CollectionViewedEventData = {
    collection: {
      id: data.customData.collection.id,
      title: data.customData.collection.title,
      handle: data.customData.collection.handle,
    },
  };

  await emitEvent({
    name: 'collection_viewed',
    data: eventData,
    debug,
  });
}

export async function productAddedToCartEvent({
  data,
  debug,
}: {
  data: Data;
  debug?: boolean;
}) {
  //We are recording the new cart line added, so if there was already the same item in the cart, we need to subtract the previous quantity or amount from the event data
  const prevLine: {
    totalAmount: number;
    quantity: number;
  } = data.prevLine
    ? {
        totalAmount: data.prevLine.cost.totalAmount.amount,
        quantity: data.prevLine.quantity,
      }
    : {
        totalAmount: 0,
        quantity: 0,
      };

  const eventData: ProductAddedToCartEventData = {
    cartLine: {
      cost: {
        totalAmount: {
          amount:
            data.currentLine.cost.totalAmount.amount - prevLine.totalAmount,
          currencyCode: data.currentLine.cost.totalAmount.currencyCode,
        },
      },
      merchandise: {
        id: data.currentLine.merchandise.id,
        price: data.currentLine.merchandise.price,
        product: {
          id: data.currentLine.merchandise.product.id,
          title: data.currentLine.merchandise.title,
          vendor: data.currentLine.merchandise.product.vendor,
          type: data.currentLine.merchandise.product.productType,
        },
        sku: data.currentLine.merchandise.sku,
        title: data.currentLine.merchandise.title,
      },
      quantity: data.currentLine.quantity - prevLine.quantity,
    },
  };

  await emitEvent({
    name: 'product_added_to_cart',
    data: eventData,
    debug,
  });
}

export async function productRemovedFromCartEvent({
  data,
  debug,
}: {
  data: Data;
  debug?: boolean;
}) {
  const prevLine: {
    totalAmount: number;
    quantity: number;
  } = data.prevLine
    ? {
        totalAmount: data.prevLine.cost.totalAmount.amount,
        quantity: data.prevLine.quantity,
      }
    : {
        totalAmount: 0,
        quantity: 0,
      };

  const eventData: ProductAddedToCartEventData = {
    cartLine: {
      cost: {
        totalAmount: {
          amount: prevLine.totalAmount - data.currentLine.cost.totalAmount,
          currencyCode: data.currentLine.cost.totalAmount.currencyCode,
        },
      },
      merchandise: {
        id: data.currentLine.merchandise.id,
        price: data.currentLine.merchandise.price,
        product: {
          id: data.currentLine.merchandise.product.id,
          title: data.currentLine.merchandise.title,
          vendor: data.currentLine.merchandise.product.vendor,
          type: data.currentLine.merchandise.product.productType,
        },
        sku: data.currentLine.merchandise.sku,
        title: data.currentLine.merchandise.title,
      },
      quantity: prevLine.quantity - data.currentLine.quantity,
    },
  };

  await emitEvent({
    name: 'product_removed_from_cart',
    data: eventData,
    debug,
  });
}

export async function searchSubmittedEvent({
  data,
  debug,
}: {
  data: Data;
  debug?: boolean;
}) {
  const eventData: SearchSubmittedEventData = {
    searchResult: {
      query: data.searchTerm,
      productVariants: data.searchResults.map((product: any) => {
        const firstVariant = product.variants.nodes[0];
        return {
          price: firstVariant.price,
          product: {
            title: product.title,
            vendor: product.vendor,
            id: product.id,
            type: product.productType,
          },
          id: firstVariant.id,
          sku: firstVariant.sku,
          title: firstVariant.title,
        };
      }),
    },
  };

  await emitEvent({
    name: 'search_submitted',
    data: eventData,
    debug,
  });
}
