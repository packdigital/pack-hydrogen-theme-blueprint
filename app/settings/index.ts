import {registerStorefrontSettingsSchema} from '@pack/react';

import account from './account';
import analytics from './analytics';
import cart from './cart';
import collection from './collection';
import footer from './footer';
import header from './header';
import notFound from './not-found';
import localization from './localization';
import product from './product';
import search from './search';
import type {AccountSettings} from './account';
import type {AnalyticsSettings} from './analytics';
import type {CartSettings} from './cart';
import type {CollectionSettings} from './collection';
import type {FooterSettings} from './footer';
import type {HeaderSettings} from './header';
import type {LocalizationSettings} from './localization';
import type {NotFoundSettings} from './not-found';
import type {ProductSettings} from './product';
import type {SearchSettings} from './search';

export function registerStorefrontSettings() {
  registerStorefrontSettingsSchema([
    account,
    analytics,
    cart,
    collection,
    footer,
    header,
    localization,
    notFound,
    product,
    search,
  ]);
}

export interface Settings {
  account: AccountSettings;
  analytics: AnalyticsSettings;
  cart: CartSettings;
  collection: CollectionSettings;
  footer: FooterSettings;
  header: HeaderSettings;
  localization: LocalizationSettings;
  notFound: NotFoundSettings;
  product: ProductSettings;
  search: SearchSettings;
}
