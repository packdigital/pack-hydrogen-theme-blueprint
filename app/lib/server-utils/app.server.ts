import {redirect} from 'react-router';

export const getCookieDomain = (url: string) => {
  try {
    const {hostname} = new URL(url);
    const domainParts = hostname.split('.');
    return `.${
      domainParts.length > 2 ? domainParts.slice(-2).join('.') : hostname
    }`;
  } catch (error) {
    console.error(`getCookieDomain:error:`, error);
    return '';
  }
};

/**
 * Checks if a URL contains trailing encoded whitespace characters and returns a redirect response if needed.
 * This helps fix URLs where users accidentally add trailing spaces like: /collections/handle%20
 *
 * @param request - The incoming request object
 * @returns A redirect Response if URL needs cleaning, null if URL is already clean
 *
 * @example
 * ```typescript
 * // In a route loader
 * const urlRedirect = checkForTrailingEncodedSpaces(request);
 * if (urlRedirect) return urlRedirect;
 * ```
 */
export function checkForTrailingEncodedSpaces(
  request: Request,
): Response | null {
  const url = new URL(request.url);
  const rawPathname = url.pathname;

  // Remove trailing encoded spaces (%20) and other common problematic encoded characters
  const cleanedPathname = rawPathname
    .replace(/(%20)+$/, '') // Remove trailing %20 (spaces)
    .replace(/(%09)+$/, '') // Remove trailing %09 (tabs)
    .replace(/(%0A)+$/, '') // Remove trailing %0A (line feeds)
    .replace(/(%0D)+$/, ''); // Remove trailing %0D (carriage returns)

  if (rawPathname !== cleanedPathname) {
    const newUrl = `${url.origin}${cleanedPathname}${url.search}${url.hash}`;
    return redirect(newUrl, {status: 301});
  }

  return null;
}
