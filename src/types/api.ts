// Strongly-typed backend API contracts

export interface LoginVerifyRequest {
  tc: string;
  phone: string;
}
export interface LoginVerifyResponse {
  success?: boolean;
  requestId?: string;
  message?: string;
}

export interface OtpVerifyRequest {
  code: string;
  tc?: string;
  phone?: string;
}
export interface OtpVerifyResponse {
  token: string;
}

export interface LogoutResponse {
  success: boolean;
}

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

export interface ApplicationCheckRequest {
  tc: string;
  phone: string;
}
export interface ApplicationCheckResponse {
  durum: 'onaylandi' | 'beklemede' | 'reddedildi' | 'bulunamadi';
  mesaj: string;
  basvuruTarihi?: string;
  sonGuncelleme?: string;
  aciklama?: string;
}
