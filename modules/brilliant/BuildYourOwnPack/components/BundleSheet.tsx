import {Image} from '@shopify/hydrogen-react';
import {ProductVariant} from '@shopify/hydrogen-react/storefront-api-types';
import {useIsHydrated} from 'app/hooks/useIsHydrated';
import {CircleArrowLeft, CircleX} from 'lucide-react';
import {useCallback, useMemo} from 'react';

import {AddToCart} from './AddToCart';

import {Button} from '~/components/ui/button';
import {Card, CardContent} from '~/components/ui/card';
import {ScrollArea, ScrollBar} from '~/components/ui/scroll-area';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '~/components/ui/sheet';

export function BundleSheet({
  open,
  onOpenChange,
  selectedItems,
  handleRemoveFromBundle,
  selectedBundle,
  clid,
}: {
  open: boolean;
  onOpenChange: (val: boolean) => void;
  selectedItems: ProductVariant[];
  handleRemoveFromBundle: (id: string) => void;
  selectedBundle: ProductVariant | undefined;
  clid: string;
}) {
  const isHydrated = useIsHydrated();
  const addToCartUnlocked = useMemo(() => {
    return true;
  }, []);

  const afterAddHandler = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  const bundleProgress = useMemo(() => {
    return selectedItems.length + '/' + selectedBundle?.title;
  }, [selectedBundle?.title, selectedItems.length]);

  if (!isHydrated) {
    return null;
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" size="sm" className="flex h-full flex-col p-2">
        <SheetHeader className="mb-2 border-b-2 border-blue-400 p-0">
          <SheetTitle className="flex items-center justify-start gap-2">
            <Button size="icon" onClick={() => onOpenChange(false)}>
              <CircleArrowLeft className="size-6" />
            </Button>
            <h5 className="items-center">Selected Items: {bundleProgress}</h5>
          </SheetTitle>
          <SheetDescription className="pb-2">
            Review your selected items before adding to cart.
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 flex-col gap-2 overflow-y-auto pr-2">
          <div className="grid grid-cols-1 gap-2 pb-8 pt-4 md:grid-cols-1">
            {selectedItems.map((item, index) => (
              <SheetItem
                key={item.id + index}
                item={item}
                handleRemoveFromBundle={handleRemoveFromBundle}
              ></SheetItem>
            ))}
          </div>
          <ScrollBar orientation="vertical" />
        </ScrollArea>

        <div className="sticky bottom-0 border-t bg-background p-2">
          <AddToCart
            bundle={selectedItems}
            addToCartUnlocked={addToCartUnlocked}
            clid={clid}
            selectedBundle={selectedBundle}
            afterAdd={afterAddHandler}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
// handleRemoveFromBundle = {handleRemoveFromBundle};
function SheetItem({
  item,
  handleRemoveFromBundle,
}: {
  item: ProductVariant;
  handleRemoveFromBundle: (id: string) => void;
}) {
  const itemImageData = useMemo(
    () => ({
      altText: item.product?.title || '',
      url: item.image?.url || '',
      width: item.image?.width || 0,
      height: item.image?.height || 0,
    }),
    [
      item.image?.height,
      item.image?.url,
      item.image?.width,
      item.product?.title,
    ],
  );

  const onPressHandler = useCallback(() => {
    handleRemoveFromBundle(item.id);
  }, [handleRemoveFromBundle, item.id]);

  return (
    <Card className="relative rounded-sm bg-gray-100">
      <CardContent className="p-1">
        <div className="flex flex-row flex-wrap items-center justify-start gap-3">
          <Image
            data={itemImageData}
            aspectRatio={'1/1'}
            width="40px"
            className="aspect-square size-[40px] rounded-lg object-cover"
          />
          <div className="grow text-base font-medium md:text-sm md:font-normal">
            {item?.product?.title}
          </div>
          <div className="">
            <Button
              className="rounded-sm"
              size="icon"
              onClick={onPressHandler}
              variant="destructive"
            >
              <CircleX className="text-white" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
