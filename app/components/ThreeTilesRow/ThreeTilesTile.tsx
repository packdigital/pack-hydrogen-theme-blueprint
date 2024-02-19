import {getAspectRatioFromClass} from '~/lib/utils';
import {Image, Link, Svg} from '~/components';

interface ThreeTilesTileProps {
  aspectRatio: string;
  item: Record<string, any>;
  textColor: string;
}

export function ThreeTilesTile({
  aspectRatio = 'aspect-[3/4]',
  item,
  textColor,
}: ThreeTilesTileProps) {
  return (
    <div className="flex w-full flex-col gap-4" style={{color: textColor}}>
      <Link
        aria-label={item.heading}
        to={item.link?.url}
        newTab={item.link?.newTab}
        tabIndex={-1}
        type={item.link?.type}
      >
        <Image
          data={{
            altText: item.alt,
            url: item.image?.src,
            width: item.image?.width,
            height: item.image?.height,
          }}
          aspectRatio={getAspectRatioFromClass(aspectRatio)}
          crop={item.crop}
          sizes="(min-width: 1024px) 30vw, (min-width: 768px) 40vw, 70vw"
        />
      </Link>

      <div className="inset-0 flex h-full w-full flex-col items-start gap-4">
        <Link
          aria-label={item.heading}
          to={item.link?.url}
          newTab={item.link?.newTab}
          type={item.link?.type}
        >
          <div className="group flex">
            <h2 className="text-xl lg:text-2xl">{item.heading}</h2>

            <span className="ml-[0.75rem] block max-w-[1.25rem] transition-transform lg:group-hover:translate-x-2">
              <Svg
                src="/svgs/arrow-right.svg#arrow-right"
                title="Arrow"
                viewBox="0 0 24 24"
              />
            </span>
          </div>
        </Link>

        {item.description && <p>{item.description}</p>}

        {item.link?.text && (
          <div>
            <Link
              aria-label={item.link.text}
              className="text-label text-main-underline"
              to={item.link.url}
              newTab={item.link.newTab}
              tabIndex={-1}
              type={item.link.type}
            >
              {item.link.text}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

ThreeTilesTile.displayName = 'ThreeTilesTile';
