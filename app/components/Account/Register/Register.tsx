import {useState} from 'react';
import {useSiteSettings} from '@pack/react';

import {Link} from '~/components';
import type {SiteSettings} from '~/lib/types';

import {ForgotPasswordForm} from '../Login/ForgotPasswordForm';
import {LoginForm} from '../Login/LoginForm';

import {RegisterForm} from './RegisterForm';

export function Register() {
  const siteSettings = useSiteSettings() as SiteSettings;
  const settings = siteSettings?.settings?.account;
  const {pageHeading, loginText, loginLinkText} = {
    ...settings?.register,
  };

  const [isForgotPassword, setIsForgotPassword] = useState(false);

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-title-h2 mb-6">{pageHeading}</h1>

      <div className="mx-auto grid w-full max-w-[28rem] grid-cols-1 gap-5 md:max-w-[64rem] md:grid-cols-2">
        <div className="hidden md:block">
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

        <div>
          <RegisterForm settings={settings} />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-x-1.5 md:hidden">
        <p>{loginText}</p>
        <Link
          aria-label="Go to login page"
          className="text-underline font-bold"
          to="/account/login"
        >
          {loginLinkText}
        </Link>
      </div>
    </div>
  );
}

Register.displayName = 'Register';
