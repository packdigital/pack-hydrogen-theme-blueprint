import clsx from 'clsx';

import {Svg} from '~/components/Svg';

interface VideoPlayToggleProps {
  className?: string;
  isPaused: boolean;
  onToggle: () => void;
}

/**
 * Pause/play button for autoplaying or looping video (WCAG 2.2.2). Place it
 * inside a positioned container, and outside any link or button.
 * Pair with `useVideoPauseControl`.
 */
export function VideoPlayToggle({
  className,
  isPaused,
  onToggle,
}: VideoPlayToggleProps) {
  return (
    <button
      aria-label={isPaused ? 'Play video' : 'Pause video'}
      className={clsx(
        'absolute bottom-3 left-3 z-[1] flex size-8 items-center justify-center rounded-full border border-border bg-white text-black',
        className,
      )}
      onClick={onToggle}
      type="button"
    >
      <Svg
        className="w-3 text-current"
        src={isPaused ? '/svgs/play.svg#play' : '/svgs/pause.svg#pause'}
        viewBox="0 0 24 24"
      />
    </button>
  );
}

VideoPlayToggle.displayName = 'VideoPlayToggle';
