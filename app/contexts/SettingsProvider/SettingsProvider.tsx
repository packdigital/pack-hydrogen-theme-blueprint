import {useMemo, useReducer} from 'react';
import type {ReactNode} from 'react';
import type {Customer} from '@shopify/hydrogen-react/storefront-api-types';

import type {Action, Dispatch, SettingsState} from '~/lib/types';
import {useRootLoaderData} from '~/hooks';

import {Context} from './useSettingsContext';

const settingsState = {
  isPreviewModeEnabled: false,
  previewModeCustomer: undefined,
  settings: {},
};

const reducer = (state: SettingsState, action: Action) => {
  switch (action.type) {
    case 'SET_PREVIEW_MODE_CUSTOMER':
      return {
        ...state,
        previewModeCustomer: action.payload,
      };

    default:
      throw new Error(`Invalid Context action of type: ${action.type}`);
  }
};

const actions = (dispatch: Dispatch) => ({
  setPreviewModeCustomer: (customer: Customer | null | undefined) => {
    dispatch({type: 'SET_PREVIEW_MODE_CUSTOMER', payload: customer});
  },
});

export function SettingsProvider({children}: {children: ReactNode}) {
  const {isPreviewModeEnabled, siteSettings} = useRootLoaderData();
  const [state, dispatch] = useReducer(reducer, {
    ...settingsState,
    settings: siteSettings?.data?.siteSettings?.settings,
    isPreviewModeEnabled,
  });

  const value = useMemo(() => ({state, actions: actions(dispatch)}), [state]);

  return <Context.Provider value={value}>{children}</Context.Provider>;
}
