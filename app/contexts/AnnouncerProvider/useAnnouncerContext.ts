import {createContext, useContext} from 'react';

export type Politeness = 'polite' | 'assertive';

export interface AnnouncerContext {
  announce: (message: string, politeness?: Politeness) => void;
}

export const Context = createContext<AnnouncerContext>({
  announce: () => {},
});

export const useAnnouncerContext = () => useContext(Context);
