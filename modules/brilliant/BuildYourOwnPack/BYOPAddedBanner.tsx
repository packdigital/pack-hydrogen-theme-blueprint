// components/BundleAddedBanner.tsx
import {CheckCircle, X} from 'lucide-react';

import {Alert, AlertTitle} from '~/components/ui/alert';

interface BundleAddedBannerProps {
  /** when true, shows the banner */
  visible: boolean;
  /** call this to hide/dismiss */
  onClose: () => void;
  /** optional custom message */
  message?: string;
}

export function BundleAddedBanner({
  visible,
  onClose,
  message = 'Bundle added to cart!',
}: BundleAddedBannerProps) {
  if (!visible) return null;

  return (
    <div className="flex justify-center p-8">
      <Alert
        variant="default"
        className="w-full max-w-3xl rounded border-green-200 bg-green-50 text-green-900 shadow"
      >
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle className="size-5 text-green-500" />
            <AlertTitle className="font-medium">{message}</AlertTitle>
          </div>
          <button
            onClick={onClose}
            aria-label="Dismiss notification"
            className="rounded p-1 hover:bg-green-100"
          >
            <X className="size-5 text-green-500" />
          </button>
        </div>
      </Alert>
    </div>
  );
}
