import {memo} from 'react';

import {FooterMenu} from './FooterMenu';

import {Link} from '~/components/Link';
import {Svg} from '~/components/Svg';
import {useSettings} from '~/hooks';

export const Footer = memo(() => {
  const {footer, localization} = useSettings();
  const {bgColor = 'var(--black)', textColor = 'var(--white)'} = {...footer};

  return (
    <footer className="bg-gray-900 text-gray-200">
      <div className="container mx-auto px-4 py-6">
        <div className="items-center justify-center lg:flex lg:gap-8">
          <div className="p-2 md:mb-6 lg:mb-0 lg:w-1/5">
            <Link
              aria-label="Go to homepage"
              className={`flex items-center text-text`}
              style={{}}
              to="/"
            >
              <Svg
                className="h-16"
                src="/svgs/brilliant-layers-logo.svg#brilliant-layers-logo"
                title="Brilliant Layers logo"
                viewBox="0 0 180 180"
              />
              <span className="px-2 font-heading text-2xl tracking-wide text-white">
                Brilliant Layers
              </span>
            </Link>
            <p className=" p-2 text-sm text-gray-400">
              Premium 3D printed collectibles and toys designed with imagination
              and crafted with precision.
            </p>
          </div>

          <FooterMenu settings={footer} />
        </div>
        <div className="mt-8 border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
          <p className="">
            © {new Date().getFullYear()} Brilliant Layers. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = 'Footer';
