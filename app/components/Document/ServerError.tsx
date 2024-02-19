const isDevelopment = process.env.NODE_ENV === 'development';

type Error = {stack: string};

interface ServerErrorProps {
  error: Error | unknown;
}

/*
 * Theme styling does not apply; use inline styles
 */

export function ServerError({error}: ServerErrorProps) {
  const errorStack = (error as Error)?.stack || '';
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Server Error</title>
      </head>

      <body>
        <div
          style={{
            padding: '24px',
            display: 'flex',
            justifyContent: 'center',
          }}
          data-comp="server-error"
        >
          <div
            style={{
              overflow: 'hidden',
              fontFamily: 'system-ui, sans-serif',
              width: '100%',
              maxWidth: '1280px',
            }}
          >
            <h1
              style={{
                marginBottom: '16px',
                marginTop: 0,
                fontSize: '24px',
              }}
            >
              Server Error
            </h1>

            {!isDevelopment && (
              <div style={{marginBottom: '24px'}}>
                <p
                  style={{color: '#EF4444'}}
                  role="alert"
                  aria-live="assertive"
                >
                  An error has occurred on this page
                </p>

                <a href="/">Return to Homepage</a>
              </div>
            )}

            <pre
              style={{
                overflow: 'auto',
                backgroundColor: 'rgba(191,85,64,0.1)',
                padding: '2rem',
                color: '#EF4444',
              }}
            >
              {errorStack}
              test
            </pre>

            <p className="mt-4 text-xs text-mediumDarkGray">
              This page can only load until the server side error is resolved.
            </p>
          </div>
        </div>
      </body>
    </html>
  );
}

ServerError.displayName = 'ServerError';
