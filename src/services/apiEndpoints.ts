export const API = {
  auth: {
    loginVerify: '/api/auth/login-verify',
    otpVerify: '/api/auth/otp-verify',
    logout: '/api/auth/logout'
  },

  user: {
    profile: '/api/user/profile',
    balance: '/api/user/balance',
    discounts: '/api/user/discounts',
    updatePhone: '/api/user/phone',
    updateEmail: '/api/user/email',
    updatePassword: '/api/user/password'
  },

  application: {
    check: '/api/application/check'
  },

  transactions: {
    list: '/api/transactions',
    detail: (id: string | number) => `/api/transactions/${id}`,
    report: (id: string | number) => `/api/transactions/${id}/report`
  },

  content: {
    announcements: '/api/announcements'
  }
} as const;

export type ApiEndpoints = typeof API;
