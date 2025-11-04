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
