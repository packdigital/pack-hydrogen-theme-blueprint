import {ExternalLink} from 'lucide-react';

export function FlipDeckUpsell() {
  return (
    <div className="flex w-full flex-col items-center px-3">
      <a
        target="_new"
        href="https://www.tiktok.com/@mzmdigitaldesign/video/7456929017573215519"
      >
        <div className="flex items-center gap-3">
          <h3 className="text-h3 py-2 text-2xl">
            MZM Digital Design - Tutorial Video on Tik Tok
          </h3>
          <ExternalLink />
        </div>
      </a>

      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <video
        src="https://cdn.shopify.com/videos/c/o/v/27e9f567760a441f9c9af78ed0cc4d60.mp4"
        controls
        width={360}
        height={640}
        className="rounded-lg"
      >
        Sorry, your browser doesn’t support embedded videos.
      </video>
    </div>
  );
}
