import {Fragment, useEffect, useRef, useState, useCallback} from 'react';

import {Container} from '~/components';
import {useLoadScript} from '~/hooks';

import {FormField} from './FormField';
import type {FormBuilderCms} from './FormBuilder.types';
import {Schema} from './FormBuilder.schema';
import {useForm} from './useForm';

export function FormBuilder({cms}: {cms: FormBuilderCms}) {
  const formRef = useRef<HTMLFormElement>(null);
  const captchaRef = useRef(null);

  const {endpoint, heading, fields, section, submitText} = cms;
  const {parsedFields} = useForm({fields});

  const [errors, setErrors] = useState<string[]>([]);
  const [captchaLoaded, setCaptchaLoaded] = useState(false);

  const renderCaptcha =
    typeof document !== 'undefined' && window.grecaptcha?.render;
  const captchaReady = typeof renderCaptcha === 'function';
  const recaptchaEnabled =
    cms.recaptchaEnabled && !!window.ENV?.PUBLIC_RECAPTCHA_SITE_KEY;

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      try {
        setErrors([]);
        const formIsValid = formRef.current?.checkValidity();
        if (!recaptchaEnabled || !captchaLoaded || !formIsValid) return;
        e.preventDefault();
        // Check if captcha is verified if captcha was originally rendered
        const captchaResponse = await window.grecaptcha?.getResponse();
        if (!captchaResponse) {
          setErrors(['Please verify you are not a robot']);
          return;
        }
        formRef.current?.submit();
      } catch (error) {
        console.error(error instanceof Error ? error.message : error);
      }
    },
    [recaptchaEnabled, captchaLoaded],
  );

  // Render captcha if recaptcha is enabled and captcha is ready
  // Must add PUBLIC_RECAPTCHA_SITE_KEY to env variables
  // See: https://developers.google.com/recaptcha/intro
  useEffect(() => {
    try {
      if (!captchaReady || !recaptchaEnabled) return;
      renderCaptcha('form-captcha-widget', {
        sitekey: window.ENV?.PUBLIC_RECAPTCHA_SITE_KEY,
      });
    } catch (error) {
      console.error(error);
    }
  }, [captchaReady, recaptchaEnabled]);

  // Observe when captcha is loaded to permit form submission
  useEffect(() => {
    if (!captchaRef.current || !recaptchaEnabled) return undefined;
    const observer = new MutationObserver(() => {
      setCaptchaLoaded(true);
      observer.disconnect();
    });
    observer.observe(captchaRef.current, {
      attributes: true,
      characterData: true,
      childList: true,
      subtree: true,
    });
    return () => {
      observer.disconnect();
    };
  }, [recaptchaEnabled]);

  useLoadScript(
    {id: 'recaptcha-script', src: 'https://www.google.com/recaptcha/api.js'},
    'head',
  );

  return (
    <Container container={cms.container}>
      <div className="px-contained py-contained">
        <div className={`mx-auto ${section?.maxWidth}`}>
          {heading && (
            <h2 className="text-h2 mb-4 md:mb-6 lg:mb-8">{heading}</h2>
          )}

          <form
            action={endpoint}
            className="grid grid-cols-2 gap-4"
            encType="multipart/form-data"
            method="POST"
            ref={formRef}
          >
            {parsedFields?.map((field) => (
              <Fragment key={field.name}>
                <FormField field={field} />
              </Fragment>
            ))}

            <div className="col-span-2 flex flex-col gap-4">
              {recaptchaEnabled && (
                <div ref={captchaRef} className="my-4">
                  <div id="form-captcha-widget" />
                </div>
              )}

              <button
                className={`btn-primary mt-4 w-auto max-w-48 ${
                  endpoint ? 'cursor-pointer' : 'cursor-not-allowed'
                }`}
                disabled={!endpoint}
                onClick={handleSubmit}
                type="submit"
              >
                {submitText || 'Submit'}
              </button>

              {errors?.length > 0 && (
                <div className="flex flex-col gap-1">
                  {errors.map((error) => (
                    <p key={error} className="text-red-500">
                      {error}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </Container>
  );
}

FormBuilder.displayName = 'FormBuilder';
FormBuilder.Schema = Schema;
