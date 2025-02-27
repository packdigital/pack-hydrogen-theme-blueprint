export type WaitUntil = (promise: Promise<unknown>) => void;

export type AdminHeaders = {
  /** A unique ID that correlates all sub-requests together. */
  requestGroupId: string | null;
  /** The IP address of the client. */
  buyerIp: string | null;
  /** The cookie header from the client  */
  cookie: string | null;
  /** The purpose header value for debugging */
  purpose: string | null;
};
