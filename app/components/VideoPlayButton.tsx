import clsx from 'clsx';

import {Svg} from '~/components/Svg';

/**
 * Compact play button shown when the browser blocks autoplay, so a video never
 * looks like a still image. `onPlay` should call the video's play() directly
 * so it runs from the click's user gesture. Use `corner` where text or CTAs
 * sit over the video so the button doesn't cover them.
 *
 * z-[2] clears section content layers (z-auto, and the z-[1] clickable-slide
 * link) so the button stays tappable. Sections don't create a stacking
 * context, so a higher value would paint over the fixed header (z-20).
 */
export function VideoPlayButton({
  className,
  label = 'Play video',
  onPlay,
  position = 'center',
}: {
  className?: string;
  label?: string;
  onPlay: () => void;
  position?: 'center' | 'corner';
}) {
  return (
    <button
      aria-label={label}
      className={clsx(
        'absolute z-[2] flex items-center justify-center rounded-full bg-[rgba(0,0,0,0.4)] text-white transition hover:bg-[rgba(0,0,0,0.6)]',
        position === 'center'
          ? 'left-1/2 top-1/2 size-14 -translate-x-1/2 -translate-y-1/2 lg:size-16'
          : 'bottom-4 right-4 size-10 md:bottom-6 md:right-6',
        className,
      )}
      onClick={(event) => {
        // Video tiles can sit inside a link; play instead of navigating
        event.preventDefault();
        event.stopPropagation();
        onPlay();
      }}
      type="button"
    >
      <Svg
        className="ml-0.5 w-1/2"
        src="/svgs/play.svg#play"
        title="Play"
        viewBox="0 0 24 24"
      />
    </button>
  );
}

VideoPlayButton.displayName = 'VideoPlayButton';
