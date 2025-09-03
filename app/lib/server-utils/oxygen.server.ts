// https://github.com/Shopify/hydrogen/discussions/1323 - Getting country from Geolocation IP

export type OxygenEnv = {
  buyer: {
    readonly ip: string | undefined;
    readonly country: string | undefined;
    readonly continent: string | undefined;
    readonly city: string | undefined;
    readonly isEuCountry: boolean;
    readonly latitude: string | undefined;
    readonly longitude: string | undefined;
    readonly region: string | undefined;
    readonly regionCode: string | undefined;
    readonly timezone: string | undefined;
  };
};

export function getOxygenEnv(request: Request): OxygenEnv {
  return Object.freeze({
    buyer: {
      ip: request.headers.get('oxygen-buyer-ip') ?? undefined,
      country: request.headers.get('oxygen-buyer-country') ?? undefined,
      continent: request.headers.get('oxygen-buyer-continent') ?? undefined,
      city: request.headers.get('oxygen-buyer-city') ?? undefined,
      isEuCountry: Boolean(request.headers.get('oxygen-buyer-is-eu-country')),
      latitude: request.headers.get('oxygen-buyer-latitude') ?? undefined,
      longitude: request.headers.get('oxygen-buyer-longitude') ?? undefined,
      region: request.headers.get('oxygen-buyer-region') ?? undefined,
      regionCode: request.headers.get('oxygen-buyer-region-code') ?? undefined,
      timezone: request.headers.get('oxygen-buyer-timezone') ?? undefined,
    },
  });
}
