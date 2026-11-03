import clsx from 'clsx';

import {useShippingCutoff} from '~/hooks';
import type {ShippingCutoffPlacement} from '~/hooks';

export function ShippingCutoffMessage({
  className = '',
  placement,
}: {
  className?: string;
  placement: ShippingCutoffPlacement;
}) {
  const message = useShippingCutoff(placement);

  if (!message) return null;

  return <p className={clsx('text-sm font-bold', className)}>{message}</p>;
}

ShippingCutoffMessage.displayName = 'ShippingCutoffMessage';
