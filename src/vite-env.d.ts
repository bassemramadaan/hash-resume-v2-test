/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_INSTAPAY_LINK?: string;
  readonly VITE_INSTAPAY_ADDRESS?: string;
  readonly VITE_VODAFONE_CASH_NUMBER?: string;
  readonly VITE_PAYMENT_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
