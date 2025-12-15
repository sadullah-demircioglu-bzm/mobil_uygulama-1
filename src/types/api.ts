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
  id?: number;
  patient_id?: number;
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

// Patient show payloads
export interface PatientShowSummaryKpi {
  current: number;
  prev?: number;
  mom_change_pct?: number;
}

export interface PatientShowSummary {
  patient_id: number;
  range: {
    months: number;
    from: string;
    to: string;
  };
  monthly_total_transactions: Array<{
    year: number;
    month_number: number;
    label: string;
    month: string;
    transaction_count: number;
  }>;
  monthly_credit_discount_usage: Array<{
    year: number;
    month_number: number;
    label: string;
    month: string;
    credit_added: number;
    credit_spent: number;
    discount_applied: number;
  }>;
  monthly_balance: Array<{
    year: number;
    month_number: number;
    label: string;
    month: string;
    balance: number;
  }>;
  active_discounts_details: Array<{
    id: number;
    discount_id: number;
    code: string;
    name: string;
    type: string;
    value: number;
    assigned_at: string;
    status: string;
  }>;
  kpis: {
    total_credit_added: PatientShowSummaryKpi;
    total_credit_spent: PatientShowSummaryKpi;
    total_discount_applied: PatientShowSummaryKpi;
    remaining_balance: { current: number };
    active_discount_count: PatientShowSummaryKpi;
  };
}

export interface PatientShowResponse {
  patient: {
    id: number;
    client_id: number;
    patient_group_id: number | null;
    status: string;
    card_number: string;
    card_issued_at: string | null;
    application_id: string;
    first_name: string;
    last_name: string;
    tc_identity_no?: string;
    identity_no?: string | null;
    gender?: string | null;
    birth_date?: string | null;
    phone_number?: string | null;
    email?: string | null;
    address?: string | null;
    city?: string | null;
    district?: string | null;
    health_problem_description?: string | null;
    income_status?: string | null;
    identity_document_url?: string | null;
    medical_document_url?: string | null;
    additional_documents?: any[];
    created_at?: string;
    updated_at?: string;
    client?: {
      id: number;
      name: string;
      code: string;
    };
    patientGroup?: any;
  };
  summary?: PatientShowSummary;
}
