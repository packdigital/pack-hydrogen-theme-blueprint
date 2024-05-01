import type {ContainerSettings} from '~/settings/container';
import type {LinkCms} from '~/lib/types';

export interface MarketingSignupCms {
  type: 'email' | 'phone' | 'emailPhone';
  heading: string;
  email: {
    listId: string;
    heading: string;
    subtext: string;
    placeholder: string;
    buttonText: string;
    thankYouText: string;
  };
  phone: {
    listId: string;
    heading: string;
    subtext: string;
    placeholder: string;
    buttonText: string;
    thankYouText: string;
    smsConsentText: string;
    smsConsentLinks: {link: LinkCms}[];
  };
  container: ContainerSettings;
}

export type MarketingEmailSignupProps = MarketingSignupCms['email'] & {
  onSuccess?: () => void;
};

export type MarketingPhoneSignupProps = MarketingSignupCms['phone'];
