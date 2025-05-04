import {Slot} from '@radix-ui/react-slot';
import {cva, type VariantProps} from 'class-variance-authority';
import * as React from 'react';

import {cn} from '~/lib/utils/index';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'btn-primary',
        secondary: 'btn-secondary',
        inverseLight: 'btn-inverse-light',
        inverseDark: 'btn-inverse-dark',
        destructive: 'bg-red-500 text-white hover:bg-red-600',
      },
      size: {
        default: 'h-[3.125rem] px-5 py-3',
        sm: 'h-8 px-3 text-xs',
        lg: 'h-10 px-8',
        icon: 'size-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({className, variant, size, asChild = false, ...props}, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({variant, size, className}))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

export {Button};
