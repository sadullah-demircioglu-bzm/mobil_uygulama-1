import React, { useState } from 'react';
import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonCard,
  IonCardContent,
  IonText,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonIcon
} from '@ionic/react';
import { calendarOutline, receiptOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { EP_MAP } from '../services/apiEndpoints';
import { http } from '../services/api';
import { useEffectOnce } from '../hooks/useEffectOnce';
import { buildProtectedPayload } from '../services/otpContext';
import type {
  BalanceResponse,
  DiscountsResponse,
  TransactionStatus,
  TransactionListItem as TransactionItem,
  UserProfileResponse,
  PatientShowResponse
} from '../types/api';
import './DashboardPage.css';

interface Duyuru {
  id: number;
  tarih: string;
  baslik: string;
  icerik: string;
}

interface Islem {
  id: number;
  tarih: string;
  tur: string;
  hastane: string;
  tutar: string;
  durum: 'tamamlandi' | 'beklemede';
  doktor?: string;
  detay?: string;
  indirimOrani?: number;
  indirimTutari?: number;
  toplamTutar?: number;
}

type Discount = DiscountsResponse[number];
type UserProfile = UserProfileResponse & { indirimler?: Discount[] };
type TransactionListItem = TransactionItem;

const DashboardPage: React.FC = () => {
  const history = useHistory();
  const [selectedTab, setSelectedTab] = useState<'duyurular' | 'islemler'>('duyurular');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [balance, setBalance] = useState<BalanceResponse | null>(null);
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [announcements, setAnnouncements] = useState<Duyuru[]>([]);
  const [transactions, setTransactions] = useState<TransactionListItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffectOnce(() => {
    let mounted = true;
    (async () => {
      try {
        const showData = await http.post<PatientShowResponse>(EP_MAP.LOGIN, buildProtectedPayload({}));
        if (!mounted) return;
        setProfile(mapPatientToProfile(showData.patient));
        setBalance(deriveBalance(showData.summary));
        setDiscounts(mapDiscounts(showData.summary));
        setAnnouncements([]);
        setTransactions(mapTransactions(showData.summary));
      } catch (e: any) {
        if (!mounted) return;
        setError(e?.response?.data?.message || e?.message || 'Veriler yüklenemedi.');
        history.replace('/login');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  });

  const formatCardNumber = (raw?: string) => {
    if (!raw) return '';
    const digits = raw.replace(/\D/g, '');
    return digits.replace(/(.{4})/g, '$1 ').trim();
  };

  const mapPatientToProfile = (patient?: PatientShowResponse['patient']): UserProfile | null => {
    if (!patient) return null;
    return {
      id: patient.id,
      patient_id: patient.id,
      ad: patient.first_name,
      soyad: patient.last_name,
      kartNo: formatCardNumber(patient.card_number),
      telefon: patient.phone_number || undefined,
      eposta: patient.email || undefined,
      tcKimlik: patient.tc_identity_no || undefined
    };
  };

  const deriveBalance = (summary?: PatientShowResponse['summary']): BalanceResponse | null => {
    if (!summary) return null;
    const latestBalance = summary.kpis?.remaining_balance?.current ?? summary.monthly_balance?.[summary.monthly_balance.length - 1]?.balance;
    if (latestBalance === undefined || latestBalance === null) return null;
    return { amount: latestBalance, currency: 'TRY' };
  };

  const mapDiscounts = (summary?: PatientShowResponse['summary']): Discount[] => {
    if (!summary?.active_discounts_details) return [];
    return summary.active_discounts_details.map((d) => ({ tur: d.code || d.name, oran: d.value }));
  };

  const mapTransactions = (summary?: PatientShowResponse['summary']): TransactionListItem[] => {
    const usage = summary?.monthly_credit_discount_usage || [];
    const balances = summary?.monthly_balance || [];
    const balanceLookup = new Map(balances.map((b) => [b.month, b.balance]));

    return usage.map((item) => {
      const status: TransactionStatus = item.credit_spent > 0 ? 'tamamlandi' : 'beklemede';
      const creditAdded = Number(item.credit_added || 0);
      const creditSpent = Number(item.credit_spent || 0);
      const discount = Number(item.discount_applied || 0);
      const displayedAmount = creditSpent || creditAdded;
      const balanceForMonth = balanceLookup.get(item.month);

      return {
        id: Number(`${item.year}${String(item.month_number).padStart(2, '0')}`),
        tarih: item.label || item.month,
        tur: 'Aylık Harcama',
        hastane: `Yükleme: ${creditAdded.toLocaleString('tr-TR')} ₺ | İndirim: ${discount.toLocaleString('tr-TR')} ₺`,
        tutar: `${displayedAmount.toLocaleString('tr-TR')} ₺`,
        durum: status,
        toplamTutar: balanceForMonth
      };
    });
  };

  return (
    <IonPage>
      <IonContent className="dashboard-page">
        {loading && (
          <div style={{ padding: 16 }}>
            <IonText color="medium">Veriler yükleniyor...</IonText>
          </div>
        )}
        {!!error && (
          <div style={{ padding: 16 }}>
            <IonText color="danger">{error}</IonText>
          </div>
        )}
        {/* Kart ve Bakiye */}
        <div className="card-balance-section">
          <div className="card-visual-full">
            <div className="virtual-card-large">
              <div className="card-header">
                <IonText>
                  <p className="card-label">BEZMİALEM VAKIF KART</p>
                </IonText>
              </div>
              <div className="card-body">
                <IonText>
                  <h2 className="cardholder-name">{profile?.ad} {profile?.soyad}</h2>
                </IonText>
                <IonText color="medium">
                  <p className="card-number">{profile?.kartNo}</p>
                </IonText>
              </div>
              <div className="card-footer">
                <div className="card-chip"></div>
              </div>
            </div>
          </div>
          
          <div className="balance-info-bottom">
            <div className="balance-card">
              <IonText color="medium">
                <p className="balance-label">Mevcut Bakiye</p>
              </IonText>
              <h1 className="balance-amount">{balance ? `${balance.amount.toLocaleString('tr-TR', { style: 'currency', currency: balance.currency || 'TRY' })}` : '-'}</h1>
              <div className="balance-status">
                <span className="status-dot active"></span>
                <IonText color="medium">
                  <span className="status-text">Aktif</span>
                </IonText>
              </div>
            </div>

            {/* İndirim Oranları */}
            {discounts && discounts.length > 0 && (
              <div className="indirim-section-bottom">
                <IonText color="medium">
                  <p className="indirim-label">Tanımlı İndirimler</p>
                </IonText>
                <div className="indirim-list">
                  {discounts.map((indirim, index) => (
                    <div key={index} className="indirim-badge">
                      <span className="indirim-oran">%{indirim.oran}</span>
                      <span className="indirim-tur">{indirim.tur}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="content-tabs">
          <IonSegment 
            value={selectedTab} 
            onIonChange={e => setSelectedTab(e.detail.value as 'duyurular' | 'islemler')}
            className="custom-segment"
          >
            <IonSegmentButton value="duyurular">
              <IonLabel>Duyurular</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="islemler">
              <IonLabel>İşlemler</IonLabel>
            </IonSegmentButton>
          </IonSegment>

          <div className="tab-content">
            {selectedTab === 'duyurular' && (
              <div className="duyurular-list">
                {announcements.map(duyuru => (
                  <IonCard key={duyuru.id} className="duyuru-card">
                    <IonCardContent>
                      <div className="duyuru-header">
                        <IonIcon icon={calendarOutline} className="duyuru-icon" />
                        <IonText color="medium">
                          <span className="duyuru-date">{duyuru.tarih}</span>
                        </IonText>
                      </div>
                      <h3 className="duyuru-title">{duyuru.baslik}</h3>
                      <p className="duyuru-content">{duyuru.icerik}</p>
                    </IonCardContent>
                  </IonCard>
                ))}
              </div>
            )}

            {selectedTab === 'islemler' && (
              <div className="islemler-list">
                {transactions.slice(0, 3).map(islem => (
                  <IonCard key={islem.id} className="islem-card">
                    <IonCardContent>
                      <div className="islem-header">
                        <IonIcon icon={receiptOutline} className="islem-icon" />
                        <span className="islem-date">{islem.tarih}</span>
                      </div>
                      <h3 className="islem-title">{islem.tur}</h3>
                      <p className="islem-location">{islem.hastane}</p>
                      <div className="islem-footer">
                        <span className="islem-amount">{islem.tutar}</span>
                        <span className={`islem-status ${islem.durum}`}>
                          {islem.durum === 'tamamlandi' ? 'Tamamlandı' : 'Beklemede'}
                        </span>
                      </div>
                    </IonCardContent>
                  </IonCard>
                ))}
                {transactions.length >= 3 && (
                  <button 
                    className="see-more-button"
                    onClick={() => history.push('/islemler')}
                  >
                    Daha Fazlasını Göster
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default DashboardPage;
