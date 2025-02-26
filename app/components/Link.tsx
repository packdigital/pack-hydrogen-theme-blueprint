import {forwardRef, useMemo} from 'react';
import type {ReactNode} from 'react';
import {Link as RemixLink} from '@remix-run/react';
import type {LinkProps as RemixLinkProps} from '@remix-run/react';

import {useLocale} from '~/hooks';

/* Docs: https://remix.run/docs/en/main/components/link */

const getValidatedHref = ({
  href,
  type,
  pathPrefix,
}: {
  href: string | undefined | null;
  type: string | undefined | null;
  pathPrefix: string;
}) => {
  if (!href) return '';
  if (type === 'isPage') {
    return `${pathPrefix}${href}`;
  }
  if (type === 'isExternal') {
    if (href.startsWith('/')) return `${pathPrefix}${href}`;
    let externalHref;
    try {
      externalHref = new URL(href).href;
    } catch (error) {
      externalHref = `https://${href}`;
    }
    return externalHref;
  }
  if (type === 'isEmail') {
    return href.startsWith('mailto:') ? href : `mailto:${href}`;
  }
  if (type === 'isPhone') {
    return href.startsWith('tel:') ? href : `tel:${href}`;
  }
  return href;
};

type LinkProps = {
  children?: ReactNode;
  className?: string;
  draggable?: boolean;
  href?: string | undefined | null;
  isExternal?: boolean;
  newTab?: boolean;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  prefetch?: RemixLinkProps['prefetch']; // 'none' | 'intent' | 'viewport' | 'render'
  preventScrollReset?: RemixLinkProps['preventScrollReset'];
  relative?: RemixLinkProps['relative'];
  reloadDocument?: RemixLinkProps['reloadDocument'];
  replace?: RemixLinkProps['replace'];
  state?: RemixLinkProps['state'];
  style?: React.CSSProperties;
  tabIndex?: number | undefined;
  text?: string;
  to?: RemixLinkProps['to'] | string | undefined | null;
  type?: 'isPage' | 'isExternal' | 'isEmail' | 'isPhone' | undefined | null;
  url?: string | undefined | null;
} & React.HTMLProps<HTMLAnchorElement>;

export const Link = forwardRef(
  (
    {
      children,
      className,
      href = '', // html property
      isExternal = false, // cms property
      newTab = false,
      prefetch = 'viewport', // remix property
      preventScrollReset = false, // remix property
      relative, // remix property
      reloadDocument = false, // remix property
      replace = false, // remix property
      state, // remix property
      text = '', // cms property
      to = '', // remix property
      type = 'isPage', // cms property
      url = '', // cms property
      ...props
    }: LinkProps,
    ref: React.Ref<HTMLAnchorElement> | undefined,
  ) => {
    const {pathPrefix} = useLocale();
    const initialHref = (to || href || url) as string;

    const finalHref = useMemo(() => {
      return getValidatedHref({
        href: initialHref,
        type: isExternal ? 'isExternal' : type,
        pathPrefix,
      });
    }, [initialHref, isExternal, pathPrefix, type]);

    return finalHref ? (
      <RemixLink
        className={className}
        prefetch={prefetch}
        preventScrollReset={preventScrollReset}
        ref={ref}
        relative={relative}
        reloadDocument={reloadDocument}
        replace={replace}
        state={state}
        to={finalHref}
        {...(newTab ? {target: '_blank'} : null)}
        {...props}
      >
        {children || text}
      </RemixLink>
    ) : (
      <div className={className} ref={ref} {...props}>
        {children || text}
      </div>
    );
  },
);

Link.displayName = 'Link';
