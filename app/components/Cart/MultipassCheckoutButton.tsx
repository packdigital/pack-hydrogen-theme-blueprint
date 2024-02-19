import {useCallback, forwardRef} from 'react';

import {multipass} from '~/lib/multipass';

type MultipassCheckoutButtonProps = {
  as?: keyof React.ElementType;
  checkoutUrl: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  redirect?: boolean;
};

/*
  This component attempts to persist the customer session
  state in the checkout by using multipass.
  Note: multipass checkout is a Shopify Plus+ feature only.
*/
export const MultipassCheckoutButton = forwardRef(
  (props: MultipassCheckoutButtonProps, ref: React.Ref<HTMLButtonElement>) => {
    const {
      children,
      className = '',
      onClick,
      checkoutUrl,
      redirect = true,
    } = props;

    const checkoutHandler = useCallback(
      async (e: React.FormEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (!checkoutUrl) return;

        if (typeof onClick === 'function') {
          onClick();
        }
        // If the user is logged in we persist it in the checkout,
        // otherwise we log them out of the checkout too.
        return await multipass({
          return_to: checkoutUrl,
          redirect,
        });
      },
      [redirect, checkoutUrl, onClick],
    );

    return (
      <button
        aria-label="Checkout"
        ref={ref}
        className={className}
        onClick={checkoutHandler}
        type="button"
      >
        {children}
      </button>
    );
  },
);
