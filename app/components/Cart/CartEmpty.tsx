import {Link} from '~/components';

import type {CartEmptyProps} from './Cart.types';

export function CartEmpty({closeCart, settings}: CartEmptyProps) {
  const {links, message} = {...settings?.emptyCart};

  return (
    <div className="absolute left-1/2 top-1/2 flex w-full -translate-x-1/2 -translate-y-1/2 flex-col gap-5 px-5">
      <h3 className="text-center text-xl font-bold md:text-2xl">{message}</h3>

      {links?.length > 0 && (
        <ul className=" flex  flex-col items-center gap-5">
          {links.map(({link}, index) => {
            return (
              <li key={index}>
                <Link
                  aria-label={link?.text}
                  className="btn-primary"
                  to={link?.url}
                  newTab={link?.newTab}
                  onClick={closeCart}
                  type={link?.type}
                >
                  {link?.text}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

CartEmpty.displayName = 'CartEmpty';
