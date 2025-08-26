import {useMemo, useReducer} from 'react';
import type {ReactNode} from 'react';

import type {Action, Dispatch, SettingsState} from '~/lib/types';
import {useRootLoaderData} from '~/hooks';

import {Context} from './useSettingsContext';

const settingsState = {
  isTransparentNavPage: false,
  settings: {},
};

const reducer = (state: SettingsState, action: Action) => {
  switch (action.type) {
    default:
      throw new Error(`Invalid Context action of type: ${action.type}`);
  }
};

const actions = (dispatch: Dispatch) => ({});

export function SettingsProvider({children}: {children: ReactNode}) {
  const {siteSettings, url} = useRootLoaderData();

  const transparentNavPageHandles =
    siteSettings?.data?.siteSettings?.settings?.header?.menu?.transparentNav
      ?.pageHandles;

  const isTransparentNavPage = useMemo(() => {
    if (!transparentNavPageHandles?.length) return false;
    const {pathname} = new URL(url);
    const [route, handle] = pathname.split('/').slice(1);
    const pageHandle = route === 'pages' ? handle : undefined;
    if (!pageHandle) return false;
    return transparentNavPageHandles.includes(pageHandle);
  }, [url, JSON.stringify(transparentNavPageHandles)]);

  const [state, dispatch] = useReducer(reducer, {
    ...settingsState,
    settings: siteSettings?.data?.siteSettings?.settings,
  });

  const value = useMemo(
    () => ({
      state: {...state, isTransparentNavPage},
      actions: actions(dispatch),
    }),
    [isTransparentNavPage, state],
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
}
