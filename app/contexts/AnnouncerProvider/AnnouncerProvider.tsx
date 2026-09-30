import {useCallback, useMemo, useRef, useState} from 'react';
import type {ReactNode} from 'react';

import {Context} from './useAnnouncerContext';
import type {Politeness} from './useAnnouncerContext';

/**
 * Renders persistent, visually hidden live regions so any component can
 * announce status changes to screen readers (WCAG 4.1.3), e.g. "Added to
 * cart" or "24 products". Live regions must exist in the DOM before their text
 * changes to be announced reliably, so they live here rather than being
 * mounted alongside the message.
 */
export function AnnouncerProvider({children}: {children: ReactNode}) {
  const [messages, setMessages] = useState<Record<Politeness, string>>({
    polite: '',
    assertive: '',
  });
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const announce = useCallback(
    (message: string, politeness: Politeness = 'polite') => {
      clearTimeout(timeoutRef.current);
      // Clear first so repeating the same message is announced again
      setMessages((prev) => ({...prev, [politeness]: ''}));
      timeoutRef.current = setTimeout(() => {
        setMessages((prev) => ({...prev, [politeness]: message}));
      }, 100);
    },
    [],
  );

  const value = useMemo(() => ({announce}), [announce]);

  return (
    <Context.Provider value={value}>
      {children}
      <div className="sr-only" aria-live="polite" role="status">
        {messages.polite}
      </div>
      <div className="sr-only" aria-live="assertive" role="alert">
        {messages.assertive}
      </div>
    </Context.Provider>
  );
}
