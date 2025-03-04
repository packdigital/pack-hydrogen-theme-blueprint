import type {ContainerSettings} from '~/settings/container';
import type {ProductCms as ProductCmsType} from '~/lib/types';

export interface ProductCms {
  product: ProductCmsType;
  container: ContainerSettings;
}
