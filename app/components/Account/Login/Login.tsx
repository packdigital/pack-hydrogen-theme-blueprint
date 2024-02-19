import {useState} from 'react';
import {useSiteSettings} from '@pack/react';

import {Link} from '~/components';
import type {SiteSettings} from '~/lib/types';

import {RegisterForm} from '../Register/RegisterForm';

import {LoginForm} from './LoginForm';
import {ForgotPasswordForm} from './ForgotPasswordForm';

export function Login() {
  const siteSettings = useSiteSettings() as SiteSettings;
  const settings = siteSettings?.settings?.account;
  const {createLinkText, createText, pageHeading} = {
    ...settings?.login,
  };

  const [isForgotPassword, setIsForgotPassword] = useState(false);

  return (
    <div className="flex flex-col items-center">
      {pageHeading && <h1 className="text-title-h2 mb-6">{pageHeading}</h1>}

      <div className="mx-auto grid w-full max-w-[28rem] grid-cols-1 gap-5 md:max-w-[64rem] md:grid-cols-2">
        <div>
          {isForgotPassword ? (
            <ForgotPasswordForm
              setIsForgotPassword={setIsForgotPassword}
              settings={settings}
            />
          ) : (
            <LoginForm
              setIsForgotPassword={setIsForgotPassword}
              settings={settings}
            />
          )}
        </div>

        <div className="hidden md:block">
          <RegisterForm settings={settings} />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-x-1.5 md:hidden">
        <p>{createText}</p>
        <Link
          aria-label="Create account"
          className="text-underline font-bold"
          to="/account/register"
        >
          {createLinkText}
        </Link>
      </div>
    </div>
  );
}

Login.displayName = 'Login';
