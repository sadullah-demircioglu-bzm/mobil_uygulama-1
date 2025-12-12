export type OtpContext = {
  tc_identity_no?: string;
  identity_no?: string;
  phone_number: string;
  otp_cipher: string;
};

const STORAGE_KEY = 'OTP_CONTEXT';
let currentOtp: string | null = null;

export function saveOtpContext(ctx: OtpContext) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ctx));
  } catch {
    // ignore storage failures
  }
}

export function loadOtpContext(): OtpContext | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as OtpContext;
  } catch {
    return null;
  }
}

export function clearOtpContext() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } finally {
    currentOtp = null;
  }
}

export function setCurrentOtp(otp: string) {
  currentOtp = otp;
}

export function getCurrentOtp() {
  return currentOtp;
}

export function buildProtectedPayload<T extends Record<string, any>>(body?: T) {
  const ctx = loadOtpContext();
  if (!ctx) throw new Error('OTP context missing');
  if (!currentOtp) throw new Error('OTP missing');
  return { ...ctx, ...(body || {}), otp: currentOtp } as T & OtpContext & { otp: string };
}
