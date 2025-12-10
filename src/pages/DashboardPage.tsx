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
import { API } from '../services/apiEndpoints';
import { http } from '../services/api';
import { useEffectOnce } from '../hooks/useEffectOnce';
import type {
  BalanceResponse,
  DiscountsResponse,
  AnnouncementItem,
  TransactionsListResponse,
  TransactionListItem as TransactionItem,
  UserProfileResponse
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
        const [p, b, d, a, t] = await Promise.all([
          http.get<UserProfileResponse>(API.user.profile, undefined, { retryMeta: { retry: 1 } }),
          http.get<BalanceResponse>(API.user.balance, undefined, { retryMeta: { retry: 1 } }),
          http.get<DiscountsResponse>(API.user.discounts, undefined, { retryMeta: { retry: 1 } }),
          http.get<AnnouncementItem[]>(API.content.announcements, undefined, { retryMeta: { retry: 1 } }),
          http.get<TransactionsListResponse>(API.transactions.list, undefined, { retryMeta: { retry: 1 } })
        ]);
        if (!mounted) return;
        setProfile(p || null);
        setBalance(b || null);
        setDiscounts(Array.isArray(d) ? d : []);
        setAnnouncements(Array.isArray(a) ? a : []);
        setTransactions(Array.isArray(t) ? t : []);
      } catch (e: any) {
        if (!mounted) return;
        setError(e?.response?.data?.message || 'Veriler yüklenemedi.');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  });

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
