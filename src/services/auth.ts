import { clearOtpContext } from './otpContext';

export function clearSession() {
  try {
    localStorage.removeItem('bezmialem_auth');
    clearOtpContext();
    localStorage.removeItem('OTP_CONTEXT');
  } catch {}
}

export async function logout(redirect: boolean = true) {
  clearSession();
  if (redirect && typeof window !== 'undefined') {
    window.location.href = '/login';
  }
}
