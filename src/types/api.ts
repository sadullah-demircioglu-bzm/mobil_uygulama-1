// Strongly-typed backend API contracts

export type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data: T | null;
  errors: string[] | null;
};

export type OtpAttemptRequest = {
  type: string;
  tc_identity_no?: string;
  identity_no?: string; // Pasaport No
  phone_number: string;
};

export type OtpAttemptData = {
  otp_cipher: string;
};

export type OtpAttemptResponse = ApiEnvelope<OtpAttemptData>;

export type OtpProtectedFields = {
  tc_identity_no?: string;
  identity_no?: string;
  phone_number: string;
  otp: string;
  otp_cipher: string;
};

export type LoginRequest = OtpProtectedFields;
export type LoginResponse = ApiEnvelope<UserProfileResponse>;

export interface UserProfileResponse {
  ad?: string;
  soyad?: string;
  kartNo?: string;
  telefon?: string;
  eposta?: string;
  tcKimlik?: string;
}

export interface BalanceResponse {
  amount: number;
  currency?: string; // default TRY
}

export interface DiscountItem {
  tur: string;
  oran: number; // percentage
}
export type DiscountsResponse = DiscountItem[];

export interface AnnouncementItem {
  id: number;
  tarih: string;
  baslik: string;
  icerik: string;
}
export type AnnouncementsResponse = AnnouncementItem[];

export type TransactionStatus = 'tamamlandi' | 'beklemede';

export interface TransactionListItem {
  id: number;
  tarih: string;
  tur: string;
  hastane: string;
  tutar: string;
  durum: TransactionStatus;
  doktor?: string;
  detay?: string;
  indirimOrani?: number;
  indirimTutari?: number;
  toplamTutar?: number;
}
export type TransactionsListResponse = TransactionListItem[];

export type TransactionDetailResponse = TransactionListItem;

export type ApplicationCheckRequest = OtpProtectedFields;
export type ApplicationCheckResponse = {
  status: "pending" | "under_review" | "approved" | "rejected" | "patient";
  decision_notes: string;
  created_at?: string;
  updated_at?: string;
};
