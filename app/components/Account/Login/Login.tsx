import {useState} from 'react';

import {Link} from '~/components';
import {useSettings} from '~/hooks';

import {RegisterForm} from '../Register/RegisterForm';

import {LoginForm} from './LoginForm';
import {ForgotPasswordForm} from './ForgotPasswordForm';

export function Login() {
  const {account} = useSettings();
  const {createLinkText, createText, pageHeading} = {...account?.login};

  const [isForgotPassword, setIsForgotPassword] = useState(false);

  return (
    <div className="flex flex-col items-center">
      {pageHeading && <h1 className="text-h2 mb-6">{pageHeading}</h1>}

      <div className="mx-auto grid w-full max-w-md grid-cols-1 gap-5 md:max-w-screen-lg md:grid-cols-2">
        <div>
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

        <div className="hidden md:block">
          <RegisterForm settings={account} />
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
