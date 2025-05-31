import {Package} from 'lucide-react';

import {Image} from '~/components/Image';
import {Badge} from '~/components/ui/badge';
import {Button} from '~/components/ui/button';

export function JigglePetSlide() {
  const imageData = {
    url: 'https://cdn.shopify.com/s/files/1/0739/0258/8119/files/JigglePets_5_4_in_rows.jpg?v=1746667887',
  };

  return (
    <div key="slide2" className="relative bg-gray-100  md:h-[600px]">
      <div className="container mx-auto flex h-full items-center px-4">
        <div className="grid w-full items-center gap-8 md:grid-cols-2">
          <div className="space-y-6">
            <Badge className="bg-green-400 px-4 py-2 text-black">
              🎯 Customize
            </Badge>
            <h1 className="text-h4 text-4xl font-semibold leading-tight text-blue-500 md:text-6xl">
              Build Your
              <br />
              <span className="text-orange-500">Perfect Pack</span>
            </h1>
            <p className="text-xl font-normal text-gray-900">
              Mix and match from over 60 adorable Jiggle Pets! Create your own
              custom bundle and save up to 60% compared to individual purchases.
            </p>
            <div className="rounded-lg bg-white p-2">
              <div className="mb-2 flex items-center justify-between gap-2 text-gray-900">
                <span className="font-normal">Bundle Savings:</span>
                <span className="text-h3 font-heading text-xl">
                  Up to 60% OFF
                </span>
              </div>
              <div className="flex w-full items-center justify-between gap-2">
                <div className="bg-white/20 rounded px-3 py-1 text-sm font-normal">
                  6 pets - Save 20%
                </div>
                <div className="bg-white/20 rounded px-3 py-1 text-sm font-normal">
                  14 pets - Save 40%
                </div>
                <div className="bg-white/20 rounded px-3 py-1 text-sm font-normal">
                  30 pets - Save 60%
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button variant="default" size="lg" className="">
                <Package className="mr-2 size-5" />
                Start Building
              </Button>
              <Button size="lg" variant="outline" className="font-heading">
                See All Pets
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="h-[500px] overflow-hidden rounded-lg shadow-lg">
              <Image
                data={imageData}
                alt={'Jiggle Pets Collection'}
                className="size-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
