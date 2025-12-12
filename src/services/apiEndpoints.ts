export const EP_MAP = {
  OTP_ATTEMPT: '/api/otp/attempt',
  LOGIN: '/api/patients/mobile/show',
  CHECK_APPLICATION: '/api/applications/show',
  UPDATE_PROFILE: '/api/patients/mobile/update',
  TRANSACTIONS_LIST: '/api/patients/mobile/transactions'
} as const;

export type ApiEndpoints = typeof EP_MAP;
