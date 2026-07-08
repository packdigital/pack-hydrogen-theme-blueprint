import type {ContainerSettings} from '~/settings/container';

interface TabCms {
  label: string;
  content: Record<string, any>[];
}

export interface TabsCms {
  heading?: string;
  tabs: TabCms[];
  container: ContainerSettings;
}
