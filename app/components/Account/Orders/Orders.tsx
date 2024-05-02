import {useLocation} from '@remix-run/react';

import {Link, Pagination} from '~/components';
import {useCustomerOrders} from '~/lib/customer';
import {usePagination, useSettings} from '~/hooks';

import {OrdersItem} from './OrdersItem';

export function Orders() {
  const {account} = useSettings();
  const {orders} = useCustomerOrders();

  const {menuItems} = {...account?.menu};
  const {
    buttonStyle,
    emptyOrdersButton,
    emptyOrdersText,
    ordersPerPage = 10,
  } = {...account?.orders};
  const {pathname} = useLocation();
  const heading = menuItems?.find(({link}) => pathname.startsWith(link?.url))
    ?.link?.text;

  const {currentPage, endIndex, setCurrentPage, startIndex} = usePagination({
    resultsPerPage: ordersPerPage,
    totalResults: orders?.length,
  });

  const headers = [
    'Order',
    'Date',
    'Payment Status',
    'Fulfillment Status',
    'Total',
  ];

  return (
    <div className="flex flex-col gap-8 md:gap-10">
      <h1 className="text-h4">{heading}</h1>

      {!orders?.length && (
        <div
          className="relative flex min-h-48 flex-col items-center justify-center gap-4"
          role="status"
        >
          <p className="text-center">{emptyOrdersText}</p>

          {emptyOrdersButton?.text && (
            <Link className={`${buttonStyle}`} to={emptyOrdersButton.url}>
              {emptyOrdersButton.text}
            </Link>
          )}
        </div>
      )}

      {!!orders?.length && (
        <div className="flex flex-col gap-8">
          <div className="hidden grid-cols-[2fr_2fr_2fr_2fr_1fr] gap-3 md:grid">
            {headers.map((header) => {
              return (
                <h6 key={header} className="text-label">
                  {header}
                </h6>
              );
            })}
          </div>

          <ul className="flex flex-col gap-3 md:gap-8">
            {orders.slice(startIndex, endIndex).map((order, index) => {
              return (
                <li key={index}>
                  <OrdersItem order={order} />
                </li>
              );
            })}
          </ul>

          {orders?.length > ordersPerPage && (
            <div className="mt-8 self-center md:mt-10">
              <Pagination
                currentPage={currentPage}
                pageNeighbors={1}
                resultsPerPage={ordersPerPage}
                setCurrentPage={setCurrentPage}
                totalResults={orders.length}
                withScrollToTop={true}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

Orders.displayName = 'Orders';
