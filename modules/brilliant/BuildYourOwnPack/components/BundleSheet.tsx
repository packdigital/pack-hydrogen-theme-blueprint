import {useIsHydrated} from 'app/hooks/useIsHydrated';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '~/components/ui/sheet';

export function BundleSheet({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (val: boolean) => void;
}) {
  const isHydrated = useIsHydrated();

  if (!isHydrated) {
    return null;
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" size="sm">
        <SheetHeader>
          <SheetTitle>Your Pack</SheetTitle>
          <div>Content List</div>
          <div>Content List</div>
          <div>Content List</div>
          <div>Content List</div>
          <div>Content List</div>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
