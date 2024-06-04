import type {ReactNode} from 'react';
import {createContext, useContext, useEffect, useMemo, useReducer} from 'react';

import type {
  Action,
  Dispatch,
  Group,
  GroupingIndexesMap,
  ProductGroupings,
  GroupingsContext,
  GroupingsState,
} from '~/lib/types';
import {useRootLoaderData} from '~/hooks';

const Context = createContext({state: {}, actions: {}} as GroupingsContext);

const reducer = (state: GroupingsState, action: Action) => {
  switch (action.type) {
    case 'SET_GROUPINGS':
      return {
        ...state,
        groupings: action.payload.groupings,
      };
    case 'SET_GROUPING_INDEXES_MAP':
      return {
        ...state,
        groupingIndexesMap: action.payload.groupingIndexesMap,
      };
    default:
      throw new Error(`Invalid Context action of type: ${action.type}`);
  }
};

const actions = (dispatch: Dispatch) => ({
  setGroupings: (groupings: ProductGroupings) => {
    dispatch({type: 'SET_GROUPINGS', payload: {groupings}});
  },
  setGroupingIndexesMap: (groupingIndexesMap: GroupingIndexesMap) => {
    dispatch({type: 'SET_GROUPING_INDEXES_MAP', payload: {groupingIndexesMap}});
  },
});

export function GroupingsProvider({children}: {children: ReactNode}) {
  const {groupingsPromise} = useRootLoaderData();
  const [state, dispatch] = useReducer(reducer, {
    groupings: null, // product groupings set in admin
    groupingIndexesMap: null, // map of product handles to index in groupings array
  });

  const value = useMemo(() => ({state, actions: actions(dispatch)}), [state]);

  useEffect(() => {
    if (!groupingsPromise) return;
    const groupingsInit = async () => {
      const initialGroupings = await groupingsPromise;
      if (!initialGroupings?.length) return;
      const groupingIndexesMap: GroupingIndexesMap = {};
      const groupings: ProductGroupings = [];
      initialGroupings.forEach((grouping: Group, index: number) => {
        const groupingProducts = [
          ...grouping.products,
          ...grouping.subgroups.flatMap(({products}) => products),
        ];
        groupingProducts.forEach(({handle}) => {
          groupingIndexesMap[handle] = index;
        });
        const updatedGrouping = {
          ...grouping,
          allProducts: groupingProducts,
          isReady: false,
        };
        groupings.push(updatedGrouping);
      });
      actions(dispatch).setGroupingIndexesMap(groupingIndexesMap);
      actions(dispatch).setGroupings(groupings);
    };
    groupingsInit();
  }, []);

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export const useGroupingsContext = () => useContext(Context);
