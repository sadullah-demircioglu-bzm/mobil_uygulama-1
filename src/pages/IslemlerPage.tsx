import React, { useState, useEffect } from 'react';
import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonCard,
  IonCardContent,
  IonIcon,
  IonText,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonSpinner
} from '@ionic/react';
import { receiptOutline, chevronForwardOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import './IslemlerPage.css';
import { EP_MAP } from '../services/apiEndpoints';
import { http } from '../services/api';
import type { TransactionsListResponse, TransactionListItem } from '../types/api';
import { useEffectOnce } from '../hooks/useEffectOnce';
import { buildProtectedPayload } from '../services/otpContext';

interface Islem {
  id: number;
  tarih: string;
  tur: string;
  hastane: string;
  doktor: string;
  tutar: string;
  durum: 'tamamlandi' | 'beklemede';
  detay: string;
  indirimOrani?: number;
  indirimTutari?: number;
  toplamTutar?: number;
}

let allItemsCache: Islem[] = [];

const IslemlerPage: React.FC = () => {
  const history = useHistory();
  const [islemler, setIslemler] = useState<Islem[]>([]);
  const [displayCount, setDisplayCount] = useState(5);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffectOnce(() => {
    (async () => {
      try {
        const data = await http.post<TransactionsListResponse>(EP_MAP.TRANSACTIONS_LIST, buildProtectedPayload({}), { retryMeta: { retry: 1 } });
        allItemsCache = Array.isArray(data) ? (data as TransactionListItem[]) : [];
        setIslemler(allItemsCache.slice(0, displayCount));
      } catch (e: any) {
        setError(e?.response?.data?.message || e?.message || 'İşlemler yüklenemedi.');
        history.replace('/login');
      } finally {
        setIsLoading(false);
      }
    })();
  });

  const loadMoreData = (event: CustomEvent<void>) => {
    setTimeout(() => {
      const newCount = displayCount + 5;
      setDisplayCount(newCount);
      setIslemler(allItemsCache.slice(0, newCount));
      (event.target as HTMLIonInfiniteScrollElement).complete();
    }, 500);
  };

  const handleCardClick = (islem: Islem) => {
    history.push(`/islemler/${islem.id}`, { islem });
  };

  return (
    <IonPage>

      <IonContent className="islemler-page">
        {isLoading ? (
          <div className="loading-container">
            <IonSpinner name="crescent" color="primary" />
          </div>
        ) : error ? (
          <div className="empty-state">
            <IonText>
              <p className="empty-text">{error}</p>
            </IonText>
          </div>
        ) : islemler.length === 0 ? (
          <div className="empty-state">
            <IonIcon icon={receiptOutline} className="empty-icon" />
            <IonText>
              <p className="empty-text">
                Henüz işlem kaydınız bulunmamaktadır.
              </p>
            </IonText>
          </div>
        ) : (
          <>
            <div className="islemler-list">
              {islemler.map((islem) => (
                <IonCard 
                  key={islem.id} 
                  className="islem-card"
                  button
                  onClick={() => handleCardClick(islem)}
                >
                  <IonCardContent>
                    <div className="islem-header">
                      <div className="header-left">
                        <IonIcon icon={receiptOutline} className="islem-icon" />
                        <span className="islem-date">{islem.tarih}</span>
                      </div>
                      <IonIcon icon={chevronForwardOutline} className="chevron-icon" />
                    </div>
                    <h3 className="islem-title">{islem.tur}</h3>
                    <p className="islem-doctor">{islem.doktor}</p>
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
            </div>

            <IonInfiniteScroll
              threshold="100px"
              disabled={displayCount >= allItemsCache.length}
              onIonInfinite={loadMoreData}
            >
              <IonInfiniteScrollContent
                loadingSpinner="crescent"
                loadingText="Yükleniyor..."
              />
            </IonInfiniteScroll>
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default IslemlerPage;
