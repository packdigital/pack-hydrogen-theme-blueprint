import {Star, ArrowRight} from 'lucide-react';

import {Image} from '~/components/Image';
import {Badge} from '~/components/ui/badge';
import {Button} from '~/components/ui/button';

interface OverlaySlideProps {
  badge?: string;
  title?: string;
  title2?: string;
  highlightedText?: string;
  /*
  description: string;
  features: string[];
  primaryCta: string;
  secondaryCta: string;
  */
  backgroundSrc?: string;
  backgroundAlt?: string;
}

export function DragonsSlide({
  badge = '✨ New Collection',
  title = 'Legendary Dragons',
  title2 = 'Await',
  highlightedText = ' Discover our most detailed and enchanting dragon collection yet. Each piece is meticulously crafted with premium materials and stunning detail. Over 20 unique color combinations!',
  backgroundSrc = 'https://cdn.shopify.com/s/files/1/0739/0258/8119/files/Crystal_Dragon_Blue_and_Matte_Orange.jpg?v=1747186934',
  backgroundAlt = 'Featured Dragon Collection',
}: OverlaySlideProps) {
  const imageData = {
    url: backgroundSrc,
  };

  return (
    <div key="slide1" className="relative h-[500px] bg-blue-400 md:h-[600px]">
      <div className="container mx-auto flex h-full items-center px-4">
        <div className="grid w-full items-center gap-8 md:grid-cols-2">
          <div className="space-y-6 text-white">
            <Badge className="bg-orange-400 px-4 py-2 text-white">
              {badge}
            </Badge>
            <h1 className="font-heading text-4xl text-shadow md:text-6xl">
              {title}
              <br />
              <span className="text-white text-shadow">{title2}</span>
            </h1>
            <p className="text-xl font-normal text-white text-shadow">
              {highlightedText}
            </p>
            <div className="flex items-center gap-4 text-white">
              <div className="flex items-center gap-1">
                <Star className="size-5 fill-[#f97316] text-black" />
                <span className="font-normal">Premium Quality</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="size-5 fill-[#f97316] text-black" />
                <span className="font-normal">Hand-Finished</span>
              </div>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button
                size="lg"
                className="bg-orange-500 text-white text-shadow hover:bg-orange-600"
              >
                Shop All Dragons
                <ArrowRight className="ml-2 size-5" />
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="h-[500px] overflow-hidden rounded-lg shadow-lg">
              <Image
                data={imageData}
                alt={backgroundAlt}
                className="size-full object-cover"
                sizes="(max-height: 500px) 100vh, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
