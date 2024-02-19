import type {ContainerSettings} from '~/settings/container';

interface Accordion {
  body: string;
  defaultOpen: boolean;
  header: string;
}

export interface AccordionProps {
  accordion: Accordion;
  headerBgColor: string;
  headerTextColor: string;
}

export interface AccordionsCms {
  accordions: Accordion[];
  heading?: string;
  headerBgColor: string;
  headerTextColor: string;
  container: ContainerSettings;
}
