import { API } from './apiEndpoints';
import { http } from './api';

export function clearSession() {
  try {
    localStorage.clear();
  } catch {}
}

export async function logout(redirect: boolean = true) {
  try {
    // Best-effort server-side logout
    await http.post(API.auth.logout, {});
  } catch {
    // ignore network/logout errors
  } finally {
    clearSession();
    if (redirect && typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }
}
