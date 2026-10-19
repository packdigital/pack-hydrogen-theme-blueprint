import {describe, expect, it} from 'vitest';

import {calculatePotentialPoints} from './potentialPoints';
import type {RivoPotentialPointsConfig} from './rivo.types';

const config = (
  overrides: Partial<RivoPotentialPointsConfig> = {},
): RivoPotentialPointsConfig => ({
  enabled: true,
  isMultiplier: false,
  pointsAmount: 100,
  currencyBaseAmount: 1,
  multiBalanceByTier: {},
  ...overrides,
});

describe('calculatePotentialPoints — gating', () => {
  it('returns null when the block is disabled', () => {
    expect(
      calculatePotentialPoints({
        config: config({enabled: false}),
        priceAmount: 50,
      }),
    ).toBeNull();
  });

  it('returns null with no config at all', () => {
    // A store with no Rivo config must render nothing rather than "earn 0".
    expect(
      calculatePotentialPoints({config: null, priceAmount: 50}),
    ).toBeNull();
    expect(
      calculatePotentialPoints({config: undefined, priceAmount: 50}),
    ).toBeNull();
  });

  it('returns null for a missing or unparseable price', () => {
    expect(
      calculatePotentialPoints({config: config(), priceAmount: null}),
    ).toBeNull();
    expect(
      calculatePotentialPoints({config: config(), priceAmount: 'free'}),
    ).toBeNull();
  });
});

describe('calculatePotentialPoints — flat award', () => {
  it('awards the same amount regardless of price', () => {
    expect(calculatePotentialPoints({config: config(), priceAmount: 5})).toBe(
      100,
    );
    expect(calculatePotentialPoints({config: config(), priceAmount: 500})).toBe(
      100,
    );
  });
});

describe('calculatePotentialPoints — multiplier', () => {
  const multiplier = config({
    isMultiplier: true,
    pointsAmount: 1,
    currencyBaseAmount: 1,
  });

  it('earns one point per currency unit at a base of 1', () => {
    expect(
      calculatePotentialPoints({config: multiplier, priceAmount: 29.99}),
    ).toBe(30);
  });

  it('truncates a partial band rather than rounding it up', () => {
    // Liquid divides with integer operands, so $25 at "1 point per $10" yields
    // 2, not 2.5 rounded to 3. Printing 3 promises points Rivo never awards.
    expect(
      calculatePotentialPoints({
        config: config({
          isMultiplier: true,
          pointsAmount: 1,
          currencyBaseAmount: 10,
        }),
        priceAmount: 25,
      }),
    ).toBe(2);
  });

  it('rounds the price to whole units BEFORE dividing by the base', () => {
    // Order of operations matters and is easy to get backwards: Liquid rounds
    // $29.99 to $30 first, so at "1 point per $10" this is 3, not 2. Flooring
    // the price instead would under-promise on nearly every .99 price.
    expect(
      calculatePotentialPoints({
        config: config({
          isMultiplier: true,
          pointsAmount: 1,
          currencyBaseAmount: 10,
        }),
        priceAmount: 29.99,
      }),
    ).toBe(3);
  });

  it('accepts a price given as a string, as Shopify returns it', () => {
    expect(
      calculatePotentialPoints({config: multiplier, priceAmount: '42.00'}),
    ).toBe(42);
  });

  it('returns null when the product is too cheap to earn anything', () => {
    // Better to render nothing than "Order and get 0 points".
    expect(
      calculatePotentialPoints({
        config: config({
          isMultiplier: true,
          pointsAmount: 1,
          currencyBaseAmount: 50,
        }),
        priceAmount: 10,
      }),
    ).toBeNull();
  });
});

describe('calculatePotentialPoints — per-tier rates', () => {
  const tiered = config({
    isMultiplier: true,
    pointsAmount: 1,
    currencyBaseAmount: 1,
    multiBalanceByTier: {
      Gold: {currencyBaseAmount: 1, balanceAmount: 3},
    },
  });

  it('uses the tier rate when the customer is in that tier', () => {
    expect(
      calculatePotentialPoints({
        config: tiered,
        priceAmount: 10,
        vipTierName: 'Gold',
      }),
    ).toBe(30);
  });

  it('matches the tier name case-insensitively', () => {
    expect(
      calculatePotentialPoints({
        config: tiered,
        priceAmount: 10,
        vipTierName: 'gold',
      }),
    ).toBe(30);
  });

  it('falls back to the default rate for an untiered customer', () => {
    expect(
      calculatePotentialPoints({
        config: tiered,
        priceAmount: 10,
        vipTierName: 'Bronze',
      }),
    ).toBe(10);
  });

  it('falls back to the default rate for a guest', () => {
    // The guest number is the selling point of the block — it must still render.
    expect(calculatePotentialPoints({config: tiered, priceAmount: 10})).toBe(
      10,
    );
  });

  it('applies a per-tier flat award too', () => {
    expect(
      calculatePotentialPoints({
        config: config({
          isMultiplier: false,
          pointsAmount: 100,
          multiBalanceByTier: {
            Gold: {currencyBaseAmount: 1, balanceAmount: 250},
          },
        }),
        priceAmount: 10,
        vipTierName: 'Gold',
      }),
    ).toBe(250);
  });
});
