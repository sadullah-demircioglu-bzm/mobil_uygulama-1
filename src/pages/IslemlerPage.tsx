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

interface Islem {
  id: number;
  tarih: string;
  tur: string;
  hastane: string;
  doktor: string;
  tutar: string;
  durum: 'tamamlandi' | 'beklemede';
  detay: string;
}

// Mock data - daha fazla item
const mockIslemlerData: Islem[] = [
  {
    id: 1,
    tarih: '15.11.2025',
    tur: 'Poliklinik Muayenesi',
    hastane: 'Bezmialem Vakıf Üniversitesi Hastanesi',
    doktor: 'Dr. Ahmet Yılmaz',
    tutar: '₺250.00',
    durum: 'tamamlandi',
    detay: 'Kardiyoloji poliklinik kontrolü yapıldı.'
  },
  {
    id: 2,
    tarih: '10.11.2025',
    tur: 'Laboratuvar Tetkiki',
    hastane: 'Bezmialem Vakıf Üniversitesi Hastanesi',
    doktor: 'Dr. Ayşe Demir',
    tutar: '₺180.00',
    durum: 'tamamlandi',
    detay: 'Tam kan sayımı ve biyokimya testleri yapıldı.'
  },
  {
    id: 3,
    tarih: '05.11.2025',
    tur: 'Görüntüleme',
    hastane: 'Bezmialem Vakıf Üniversitesi Hastanesi',
    doktor: 'Dr. Mehmet Kaya',
    tutar: '₺420.00',
    durum: 'tamamlandi',
    detay: 'Akciğer grafisi çekildi.'
  },
  {
    id: 4,
    tarih: '01.11.2025',
    tur: 'Fizik Tedavi',
    hastane: 'Bezmialem Vakıf Üniversitesi Hastanesi',
    doktor: 'Fzt. Zeynep Arslan',
    tutar: '₺150.00',
    durum: 'tamamlandi',
    detay: 'Bel fıtığı için fizik tedavi seansı.'
  },
  {
    id: 5,
    tarih: '28.10.2025',
    tur: 'Diş Tedavisi',
    hastane: 'Bezmialem Vakıf Üniversitesi Hastanesi',
    doktor: 'Dt. Fatma Çelik',
    tutar: '₺320.00',
    durum: 'tamamlandi',
    detay: 'Diş dolgu işlemi yapıldı.'
  },
  {
    id: 6,
    tarih: '25.10.2025',
    tur: 'Kontrol Muayenesi',
    hastane: 'Bezmialem Vakıf Üniversitesi Hastanesi',
    doktor: 'Dr. Can Öztürk',
    tutar: '₺200.00',
    durum: 'tamamlandi',
    detay: 'Genel dahiliye kontrolü.'
  },
  {
    id: 7,
    tarih: '20.10.2025',
    tur: 'EKG',
    hastane: 'Bezmialem Vakıf Üniversitesi Hastanesi',
    doktor: 'Dr. Selin Yıldız',
    tutar: '₺100.00',
    durum: 'tamamlandi',
    detay: 'Elektrokardiyografi çekildi.'
  },
  {
    id: 8,
    tarih: '15.10.2025',
    tur: 'Ultrason',
    hastane: 'Bezmialem Vakıf Üniversitesi Hastanesi',
    doktor: 'Dr. Ali Şahin',
    tutar: '₺280.00',
    durum: 'tamamlandi',
    detay: 'Batın ultrasonografi yapıldı.'
  }
];

const IslemlerPage: React.FC = () => {
  const history = useHistory();
  const [islemler, setIslemler] = useState<Islem[]>([]);
  const [displayCount, setDisplayCount] = useState(5);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // İlk yükleme
    setTimeout(() => {
      setIslemler(mockIslemlerData.slice(0, displayCount));
      setIsLoading(false);
    }, 500);
  }, []);

  const loadMoreData = (event: CustomEvent<void>) => {
    setTimeout(() => {
      const newCount = displayCount + 5;
      setDisplayCount(newCount);
      setIslemler(mockIslemlerData.slice(0, newCount));
      (event.target as HTMLIonInfiniteScrollElement).complete();
    }, 1000);
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
              disabled={displayCount >= mockIslemlerData.length}
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
