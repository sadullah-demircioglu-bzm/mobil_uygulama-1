export type OtpContext = {
  id?: number;
  patient_id?: number;
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
  
  const basePayload = {
    tc_identity_no: ctx.tc_identity_no,
    identity_no: ctx.identity_no,
    phone_number: ctx.phone_number,
    otp_cipher: ctx.otp_cipher,
    otp: currentOtp
  };
  
  // Include id and patient_id if available
  let payload: any = { ...basePayload };
  if (ctx.id) {
    payload.id = ctx.id;
  }
  if (ctx.patient_id) {
    payload.patient_id = ctx.patient_id;
  }
  
  // Merge with body parameters
  payload = { ...payload, ...(body || {}) };
    
  return payload as T & OtpContext & { otp: string };
}
