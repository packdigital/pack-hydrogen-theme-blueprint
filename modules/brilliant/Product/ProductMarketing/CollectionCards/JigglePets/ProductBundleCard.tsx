import {Package, Percent, ArrowRight, Sparkles, DollarSign} from 'lucide-react';

import {Image} from '~/components/Image';
import {Link} from '~/components/Link';
import {Button} from '~/components/ui/button';

interface PopularBundleCardProps {
  bundleUrl?: string;
}

export default function PopularBundleCard({
  bundleUrl = '/products/jiggle-pets-bundle',
}: PopularBundleCardProps) {
  return (
    <div className="overflow-hidden rounded-lg border-2 border-primary shadow-lg">
      <div className="p-1 bg-[url('https://cdn.shopify.com/s/files/1/0739/0258/8119/files/JigglePets_5_4_in_rows.jpg?v=1746667887')] bg-cover opacity-90">
        <div className="flex flex-col gap-6 md:flex-row">
          {/* Content Section */}
          <div className="m-4 rounded-lg  bg-white p-4 opacity-95 md:w-3/5 lg:w-1/2">
            <div className="flex flex-row items-center justify-center">
              <h3 className=" mb-1 flex items-center  text-2xl font-bold text-primary ">
                Bundle & <span className="ml-1 text-green-500">SAVE!</span>
              </h3>
            </div>

            <p className=" mb-4 text-center text-gray-700">
              Mix and match your favorite Jiggle Pets and{' '}
              <span className="font-semibold text-green-600 text-shadow-sm">
                SAVE $$$
              </span>
            </p>

            <div className="bg-white/80 mb-4 rounded-lg border border-blue-100 p-1 backdrop-blur-sm">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className=" text-lg font-bold text-blue-600">
                    &nbsp;3 Pets
                  </div>
                  <div className=" text-sm text-green-700">Save 20%</div>
                </div>
                <div className="border-x border-blue-100">
                  <div className=" text-lg font-bold text-blue-600">7 Pets</div>
                  <div className=" text-sm text-green-700">Save 30%</div>
                </div>
                <div>
                  <div className=" text-lg font-bold text-blue-600">
                    12 Pets
                  </div>
                  <div className=" text-sm text-green-700">Save 40%</div>
                </div>
              </div>
            </div>

            <div className="mb-2">
              <Link href={bundleUrl}>
                <Button className=" group w-full bg-blue-600 transition-all hover:bg-blue-700">
                  <Package className="mr-2 size-5" />
                  Build Your Custom Bundle
                  <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
