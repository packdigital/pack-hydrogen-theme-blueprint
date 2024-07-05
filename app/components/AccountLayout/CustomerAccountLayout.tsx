import {useEffect, useMemo} from 'react';
import {useLocation, useNavigate} from '@remix-run/react';
import {
  Menu,
  MenuButton,
  MenuItems,
  MenuItem,
  Transition,
} from '@headlessui/react';

import {Link, Spinner, Svg} from '~/components';
import {useCustomer, useGlobal, useLocale, useSettings} from '~/hooks';
import {useCustomerLogOut} from '~/lib/customer';
import {LOGGED_OUT_REDIRECT_TO} from '~/lib/constants';

export function CustomerAccountLayout({children}: {children: React.ReactNode}) {
  const {isPreviewModeEnabled} = useGlobal();
  const navigate = useNavigate();
  const {pathPrefix} = useLocale();
  const {pathname} = useLocation();
  const customer = useCustomer();
  const {customerLogOut} = useCustomerLogOut();
  const {account} = useSettings();

  const {helpHeading, helpItems, menuItems} = {...account?.menu};

  const activeMenuItem = useMemo(() => {
    return menuItems?.find(({link}) => {
      return pathname.startsWith(link?.url);
    });
  }, [pathname, menuItems]);

  const customerPending =
    !!isPreviewModeEnabled && typeof customer === 'undefined';

  useEffect(() => {
    if (customerPending) return;
    if (isPreviewModeEnabled && !customer) {
      navigate(`${pathPrefix}${LOGGED_OUT_REDIRECT_TO}`);
    }
  }, [customerPending]);

  if (customerPending) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <section
      className="px-contained py-contained"
      data-comp={CustomerAccountLayout.displayName}
    >
      <div className="mx-auto grid w-full max-w-screen-xl grid-cols-1 gap-8 md:grid-cols-[12rem_1fr] lg:grid-cols-[16rem_1fr]">
        <div>
          <div className="flex flex-row justify-between gap-6 pb-6 md:flex-col md:justify-start md:border-b md:border-b-border">
            <div className="flex-1">
              <h2 className="text-h4 md:text-h5 lg:text-h4 mb-1 break-words">
                Hi{customer?.firstName ? `, ${customer.firstName}` : ''}
              </h2>

              <p className="break-words text-xs">{customer?.email}</p>
            </div>

            <div>
              <button
                aria-label="Sign out"
                className="text-main-underline text-nav bg-[linear-gradient(var(--primary),var(--primary))] font-normal"
                onClick={customerLogOut}
                type="button"
              >
                Sign Out
              </button>
            </div>
          </div>

          {/* desktop nav */}
          <nav className="hidden border-b border-b-border py-6 md:block">
            <ul className="flex flex-col items-start md:gap-4 lg:gap-6">
              {menuItems?.map(({link}, index) => {
                return link?.text ? (
                  <li key={index}>
                    <Link
                      aria-label={link.text}
                      to={link.url}
                      newTab={link.newTab}
                      type={link.type}
                    >
                      <p className="text-h5 md:text-h4 lg:text-h3 hover-text-underline">
                        {link.text}
                      </p>
                    </Link>
                  </li>
                ) : null;
              })}
            </ul>
          </nav>

          {/* mobile nav */}
          <Menu as="div" className="relative w-full md:hidden">
            <MenuButton
              aria-label="Open account menu"
              className="flex h-14 w-full items-center justify-between gap-4 rounded-full border border-gray px-5 text-base"
              type="button"
            >
              <p>{activeMenuItem?.link?.text}</p>

              <Svg
                className="w-4 text-text ui-open:rotate-180"
                src="/svgs/chevron-down.svg#chevron-down"
                title="Chevron Down"
                viewBox="0 0 24 24"
              />
            </MenuButton>

            <Transition
              as="div"
              className="absolute left-0 top-[calc(100%+0.5rem)] z-10 w-full rounded-lg border border-gray bg-background text-base"
              enter="transition duration-100 ease-out"
              enterFrom="transform scale-95 opacity-0"
              enterTo="transform scale-100 opacity-100"
              leave="transition duration-50 ease-out"
              leaveFrom="transform scale-100 opacity-100"
              leaveTo="transform scale-95 opacity-0"
            >
              <MenuItems
                as="nav"
                className="scrollbar-hide flex max-h-72 flex-col gap-0 overflow-y-auto py-2"
              >
                {menuItems?.map(({link}, index) => {
                  return link?.text ? (
                    <MenuItem key={index}>
                      {({close}) => {
                        const selected = activeMenuItem?.link?.url === link.url;
                        return (
                          <Link
                            aria-label={link.text}
                            className={`w-full px-5 py-1.5 transition md:hover:bg-offWhite ${
                              selected ? 'bg-lightGray' : ''
                            }`}
                            onClick={close}
                            to={link.url}
                            newTab={link.newTab}
                            type={link.type}
                          >
                            {link.text}
                          </Link>
                        );
                      }}
                    </MenuItem>
                  ) : null;
                })}
              </MenuItems>
            </Transition>
          </Menu>

          <div className="flex flex-col gap-2 py-6 max-md:hidden">
            <h3 className="text-base font-normal">{helpHeading}</h3>

            <ul className="flex flex-col items-start">
              {helpItems?.map(({link}, index) => {
                return link?.text ? (
                  <li key={index}>
                    <Link
                      aria-label={link.text}
                      className="break-words text-xs"
                      to={link.url}
                      type={link.type}
                    >
                      {link.text}
                    </Link>
                  </li>
                ) : null;
              })}
            </ul>
          </div>
        </div>

        {children}
      </div>
    </section>
  );
}

CustomerAccountLayout.displayName = 'AccountLayout.Customer';
