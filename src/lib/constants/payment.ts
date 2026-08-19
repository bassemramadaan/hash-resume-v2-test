// Single source of truth for payment configurations and links

export const INSTAPAY_LINK =
  import.meta.env.VITE_INSTAPAY_LINK ||
  "https://ipn.eg/S/bassemramadaaaaan/instapay/1LWlmU";

export const INSTAPAY_ADDRESS =
  import.meta.env.VITE_INSTAPAY_ADDRESS || "bassemramadaaaaan@instapay";

export const VODAFONE_CASH_NUMBER =
  import.meta.env.VITE_VODAFONE_CASH_NUMBER || "01099887766";
