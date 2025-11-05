import {CartForm} from '@shopify/hydrogen';
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import type {CartQueryDataReturn} from '@shopify/hydrogen';
import type {Cart} from '@shopify/hydrogen/storefront-api-types';

import {isLocalPath} from '~/lib/utils';

const getParsedJson = (value: FormDataEntryValue | null) => {
  if (!value || typeof value !== 'string') return value;
  try {
    return JSON.parse(value);
  } catch (error) {
    return value;
  }
};

export async function action({request, context}: ActionFunctionArgs) {
  const {cart} = context;

  const formData = await request.formData();
  const action = formData.get('action');

  let status = 200;
  let result: CartQueryDataReturn;

  if (!action)
    return Response.json({errors: ['Missing `action` in body']}, {status: 400});

  switch (action) {
    case CartForm.ACTIONS.Create:
      result = await cart.create(getParsedJson(formData.get('cart')));
      break;
    case CartForm.ACTIONS.LinesAdd:
      result = await cart.addLines(getParsedJson(formData.get('lines')));
      break;
    case CartForm.ACTIONS.LinesUpdate:
      result = await cart.updateLines(getParsedJson(formData.get('lines')));
      break;
    case CartForm.ACTIONS.LinesRemove:
      result = await cart.removeLines(getParsedJson(formData.get('lineIds')));
      break;
    case CartForm.ACTIONS.DiscountCodesUpdate:
      const formDiscountCodes = getParsedJson(formData.get('discountCodes'));
      const discountCodes = (
        Array.isArray(formDiscountCodes) ? formDiscountCodes : []
      ) as string[];
      // Combine discount codes already applied on cart
      const existingCartWithDiscountCodes = (await cart.get()) as Cart;
      if (existingCartWithDiscountCodes) {
        discountCodes.push(
          ...(existingCartWithDiscountCodes.discountCodes?.map(
            ({code}) => code,
          ) || []),
        );
      }
      result = await cart.updateDiscountCodes(discountCodes);
      break;
    case CartForm.ACTIONS.BuyerIdentityUpdate:
      result = await cart.updateBuyerIdentity(
        getParsedJson(formData.get('buyerIdentity')),
      );
      break;
    case CartForm.ACTIONS.AttributesUpdateInput:
      const formAttributes = getParsedJson(formData.get('attributes'));
      const attributes = Array.isArray(formAttributes) ? formAttributes : [];
      // Combine cart attributes in cart
      const existingCartWithAttributes = (await cart.get()) as Cart;
      if (existingCartWithAttributes) {
        attributes.push(...(existingCartWithAttributes.attributes || []));
      }
      result = await cart.updateAttributes(attributes);
      break;
    case CartForm.ACTIONS.NoteUpdate:
      result = await cart.updateNote(formData.get('note') as string);
      break;
    default:
      return Response.json(
        {errors: [`${action} cart action is not defined`]},
        {status: 400},
      );
  }

  /**
   * The Cart ID may change after each mutation. We need to update it each time in the session.
   */
  let headers = new Headers();
  if (result.cart?.id) headers = cart.setCartId(result.cart.id);

  const redirectTo = formData.get('redirectTo') ?? null;
  if (typeof redirectTo === 'string' && isLocalPath(redirectTo)) {
    status = 303;
    headers.set('Location', redirectTo);
  }

  const {cart: cartResult, warnings, userErrors} = result;

  return Response.json(
    {
      cart: cartResult,
      userErrors,
      warnings,
    },
    {status, headers},
  );
}

export async function loader({context}: LoaderFunctionArgs) {
  return Response.json({cart: await context.cart.get()});
}
