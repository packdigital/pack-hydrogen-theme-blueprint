import type {ContainerSettings} from '~/settings/container';

export interface FormBuilderCms {
  endpoint: string;
  heading?: string;
  fields: Record<string, unknown>[];
  section: {
    maxWidth: string;
  };
  submitText: string;
  recaptchaEnabled: boolean;
  container: ContainerSettings;
}

export interface CountryFieldProps {
  selectClass?: string;
  name: string;
  placeholder?: string;
  required?: boolean;
}
