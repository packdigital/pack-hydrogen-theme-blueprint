import {useState} from 'react';

import {Link} from '~/components';
import {useSettings} from '~/hooks';

import {ForgotPasswordForm} from '../Login/ForgotPasswordForm';
import {LoginForm} from '../Login/LoginForm';

import {RegisterForm} from './RegisterForm';

export function Register() {
  const {account} = useSettings();
  const {pageHeading, loginText, loginLinkText} = {...account?.register};

  const [isForgotPassword, setIsForgotPassword] = useState(false);

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-h2 mb-6">{pageHeading}</h1>

      <div className="mx-auto grid w-full max-w-md grid-cols-1 gap-5 md:max-w-screen-lg md:grid-cols-2">
        <div className="hidden md:block">
          {isForgotPassword ? (
            <ForgotPasswordForm
              setIsForgotPassword={setIsForgotPassword}
              settings={account}
            />
          ) : (
            <LoginForm
              setIsForgotPassword={setIsForgotPassword}
              settings={account}
            />
          )}
        </div>

        <div>
          <RegisterForm settings={account} />
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
