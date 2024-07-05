export type Data = {data: Record<string, any>[]; errors: Record<string, any>[]};

export interface ActionProps {
  body: FormData;
  privateApiKey: string;
  publicApiKey?: string;
  apiVersion: string;
}

export interface CheckIfEmailIsInListReturn {
  status: number;
  isSubscribed: boolean;
  email: string | null;
  error: string | null;
}

export interface CheckIfPhoneNumberIsInListReturn {
  status: number;
  isSubscribed: boolean;
  phone: string | null;
  error: string | null;
}

export interface SubscribeEmailOrPhoneToListReturn {
  status: number;
  isAlreadySubscribed: boolean;
  message: string;
  error: string | null;
  email?: string | null;
  phone?: string | null;
  submittedAt: string;
}

export interface SubscribeToBackInStockReturn {
  email: string | null;
  status: number;
  message: string;
  error: string | null;
  submittedAt: string;
}
