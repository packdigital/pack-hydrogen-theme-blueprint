import {useCallback, useEffect, useMemo, useRef, useState} from 'react';

// In Firefox, setTimeout w/ duration 0 too short for browser to notice changes in DOM
const initialTransitDuration = 20;

interface Phase {
  CLOSE: 'close';
  CLOSING: 'closing';
  CLOSED: 'closed';
  OPEN: 'open';
  OPENING: 'opening';
  OPENED: 'opened';
}

type Status =
  | Phase['CLOSE']
  | Phase['CLOSING']
  | Phase['CLOSED']
  | Phase['OPEN']
  | Phase['OPENING']
  | Phase['OPENED'];

const PHASE = {
  CLOSE: 'close',
  CLOSING: 'closing',
  CLOSED: 'closed',
  OPEN: 'open',
  OPENING: 'opening',
  OPENED: 'opened',
} as Phase;

const GROUP = {
  [PHASE.CLOSE]: PHASE.CLOSE,
  [PHASE.CLOSED]: PHASE.CLOSE,
  [PHASE.OPENING]: PHASE.CLOSE,
  [PHASE.CLOSING]: PHASE.OPEN,
  [PHASE.OPEN]: PHASE.OPEN,
  [PHASE.OPENED]: PHASE.OPEN,
};

export function Expand({
  children,
  className = '',
  duration = 200,
  easing = 'ease-in-out',
  open,
  styles,
  transitions = ['height', 'opacity'],
}: {
  children: React.ReactNode;
  className?: string;
  duration?: number;
  easing?: string;
  open: boolean;
  styles?: {
    [PHASE.OPEN]: Record<string, string | number>;
    [PHASE.CLOSE]: Record<string, string | number>;
  };
  transitions?: string[];
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [status, setStatus] = useState<Status>(open ? PHASE.OPEN : PHASE.CLOSE);

  const delay = useCallback((fn: () => void, time: number) => {
    const timeout = setTimeout(fn, time);
    timeoutRef.current = timeout;
  }, []);

  const clearDelay = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  const transit = useCallback(
    (
      entering: Phase['OPENING'] | Phase['CLOSING'],
      entered: Phase['OPENED'] | Phase['CLOSED'],
      enter: Phase['OPEN'] | Phase['CLOSE'],
    ) => {
      setStatus(entering);

      delay(() => {
        setStatus(entered);

        delay(() => {
          setStatus(enter);
        }, duration);
      }, initialTransitDuration);
    },
    [duration],
  );

  const toggle = useCallback(
    (toggleOpen: boolean) => {
      clearDelay();
      if (toggleOpen) {
        transit(PHASE.OPENING, PHASE.OPENED, PHASE.OPEN);
      } else {
        transit(PHASE.CLOSING, PHASE.CLOSED, PHASE.CLOSE);
      }
    },
    [transit],
  );

  const defaultExpandStyle = useMemo(() => {
    switch (status) {
      case PHASE.OPENING:
      case PHASE.CLOSE:
      case PHASE.CLOSED:
        return {height: 0, opacity: 0, overflow: 'hidden'};
      case PHASE.OPENED:
      case PHASE.CLOSING:
        return {
          height: ref.current?.scrollHeight,
          opacity: 1,
          overflow: 'hidden',
        };
      default:
        return {height: 'auto', opacity: 1, overflow: 'unset'};
    }
  }, [status]);

  const expandStyle = useMemo(() => {
    return {
      ...defaultExpandStyle,
      ...(styles?.[GROUP[status]] || {}),
    };
  }, [defaultExpandStyle, JSON.stringify(styles)]);

  const style = useMemo(() => {
    const transition = transitions
      .map((attr) => `${attr} ${duration}ms ${easing}`)
      .join(',');
    return {
      ...expandStyle,
      transition,
    };
  }, [duration, easing, expandStyle, JSON.stringify(transitions)]);

  useEffect(() => {
    toggle(open);

    return () => {
      clearDelay();
      if (open) {
        transit(PHASE.OPENING, PHASE.OPENED, PHASE.OPEN);
      } else {
        transit(PHASE.CLOSING, PHASE.CLOSED, PHASE.CLOSE);
      }
    };
  }, [open]);

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}
