import {memo} from 'react';

import {EmailSignup} from './EmailSignup';
import {FooterLegal} from './FooterLegal';
import {FooterMenu} from './FooterMenu';

import {CountrySelector} from '~/components/CountrySelector';
import {Link} from '~/components/Link';
import {Svg} from '~/components/Svg';
import {useSettings} from '~/hooks';

export const Footer = memo(() => {
  const {footer, localization} = useSettings();
  const {bgColor = 'var(--black)', textColor = 'var(--white)'} = {...footer};

  return (
    <footer
      className="md:px-contained py-8 md:py-12 xl:py-14"
      style={{backgroundColor: bgColor, color: textColor}}
    >
      <div className="mx-auto grid max-w-[var(--content-max-width)] grid-cols-1 md:grid-cols-[1fr_300px] md:gap-x-5 md:gap-y-10 xl:grid-cols-[200px_1fr_300px]">
        <div className="order-1 col-span-1 w-full md:col-span-2 xl:col-span-1">
          <div className="flex items-center gap-6 border-b border-b-neutralLight px-4 pb-8 md:border-none md:p-0 xl:flex-col">
            <Link to="/" aria-label="Go to home page" className="">
              <Svg
                className="h-24 text-current"
                src="/svgs/brilliant-layers-logo.svg#brilliant-layers-logo"
                title="Brilliant Layers logo"
                viewBox="0 0 200 180"
              />
              <h5 className="text-center">Brilliant Layers</h5>
            </Link>

            {/*<FooterSocial settings={footer} />*/}
          </div>
        </div>

        <div className="order-3 w-full md:order-2">
          <FooterMenu settings={footer} />
        </div>

        <div className="order-2 w-full md:order-3">
          <EmailSignup settings={footer} />
        </div>

        <div className="max-md:px-contained order-4 col-span-1 flex w-full flex-col gap-4 max-md:pt-8 md:col-span-2 md:gap-6 xl:col-span-3">
          {localization?.enabled && <CountrySelector />}

          <FooterLegal settings={footer} />
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = 'Footer';
