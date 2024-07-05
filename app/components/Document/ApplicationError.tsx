import {useEffect, useState} from 'react';

import {Svg} from '~/components';

const isDevelopment = process.env.NODE_ENV === 'development';

interface ApplicationErrorProps {
  error: {stack: string} | unknown;
}

export function ApplicationError({error}: ApplicationErrorProps) {
  const [modalOpen, setModalOpen] = useState(true);

  useEffect(() => {
    if (error) {
      console.error(error);
    }
  }, [error]);

  return isDevelopment && error ? (
    <div className="pointer-events-none fixed inset-0 z-[1000] size-full">
      {modalOpen && (
        <section
          className="px-contained py-contained pointer-events-auto flex size-full items-center justify-center bg-[rgba(0,0,0,0.5)]"
          data-comp="application-error"
        >
          <aside className="flex max-h-full max-w-full justify-center overflow-hidden rounded-md bg-white p-5 drop-shadow after:absolute after:inset-x-0 after:top-0 after:h-[4px] after:w-full after:bg-red-500 md:p-10">
            <div className="flex w-full max-w-screen-xl flex-col overflow-hidden xs:max-sm:min-w-96 sm:max-md:min-w-[28rem] md:min-w-[32rem]">
              <h1
                aria-live="assertive"
                className="mb-4 font-[system-ui,sans-serif] text-[24px]"
                role="status"
              >
                Application Error
              </h1>

              <div className="flex-1 overflow-y-auto">
                <pre className="overflow-auto bg-offWhite p-8 text-red-500">
                  {error instanceof Error
                    ? error.stack
                    : typeof error === 'string'
                    ? error
                    : JSON.stringify(error, null, 2)}
                </pre>
              </div>

              <p className="mt-4 text-xs text-mediumDarkGray">
                This page can only load until the runtime error is resolved.
              </p>
            </div>

            <button
              type="button"
              aria-label="Close error modal"
              className="absolute right-5 top-5 w-5"
              onClick={() => setModalOpen(false)}
            >
              <Svg
                className="w-5"
                src="/svgs/close.svg#close"
                viewBox="0 0 24 24"
              />
            </button>
          </aside>
        </section>
      )}

      {!modalOpen && (
        <button
          aria-label="Open error modal"
          className="pointer-events-auto absolute bottom-20 left-10 rounded-lg bg-red-500 p-5 text-white drop-shadow"
          onClick={() => setModalOpen(true)}
          type="button"
        >
          1 Unhandled Error
        </button>
      )}
    </div>
  ) : (
    <section
      className="px-contained py-contained flex justify-center"
      data-comp="application-error"
    >
      <div className="container flex items-center justify-center rounded-lg border border-dashed border-red-400 py-56 text-center">
        <pre aria-live="assertive" className="text-red-400" role="alert">
          An error has occurred on this page
        </pre>
      </div>
    </section>
  );
}

ApplicationError.displayName = 'ApplicationError';
