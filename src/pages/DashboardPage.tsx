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
import { mockUser } from '../services/mockData';
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

const mockDuyurular: Duyuru[] = [
  {
    id: 1,
    tarih: '15 Kasım 2025',
    baslik: 'Yeni online randevu sistemi',
    icerik: 'Online randevu sistemimiz aktif edilmiştir. Artık randevularınızı mobil uygulama üzerinden alabilirsiniz.'
  },
  {
    id: 2,
    tarih: '10 Kasım 2025',
    baslik: 'Hafta sonu çalışma saatleri',
    icerik: 'Hafta sonu poliklinik çalışma saatlerimiz güncellendi. Yeni çalışma saatlerimiz 09:00 - 17:00 olarak belirlenmiştir.'
  },
  {
    id: 3,
    tarih: '05 Kasım 2025',
    baslik: 'Yeni laboratuvar hizmeti',
    icerik: 'Moleküler biyoloji laboratuvarımız hizmet vermeye başlamıştır.'
  }
];

const mockIslemler: Islem[] = [
  {
    id: 1,
    tarih: '15.11.2025',
    tur: 'Poliklinik Muayenesi',
    hastane: 'Bezmialem Vakıf Üniversitesi Hastanesi',
    tutar: '₺187.50',
    toplamTutar: 250,
    indirimOrani: 25,
    durum: 'tamamlandi',
    doktor: 'Dr. Ahmet Yılmaz',
    detay: 'Kardiyoloji poliklinik kontrolü yapıldı.'
  },
  {
    id: 2,
    tarih: '10.11.2025',
    tur: 'Laboratuvar Tetkiki',
    hastane: 'Bezmialem Vakıf Üniversitesi Hastanesi',
    tutar: '₺130.00',
    toplamTutar: 180,
    indirimTutari: 50,
    durum: 'tamamlandi',
    doktor: 'Dr. Ayşe Demir',
    detay: 'Tam kan sayımı ve biyokimya testleri yapıldı.'
  },
  {
    id: 3,
    tarih: '05.11.2025',
    tur: 'Görüntüleme',
    hastane: 'Bezmialem Vakıf Üniversitesi Hastanesi',
    tutar: '₺357.00',
    toplamTutar: 420,
    indirimOrani: 15,
    durum: 'tamamlandi',
    doktor: 'Dr. Mehmet Kaya',
    detay: 'Akciğer grafisi çekildi.'
  }
];

const DashboardPage: React.FC = () => {
  const history = useHistory();
  const [selectedTab, setSelectedTab] = useState<'duyurular' | 'islemler'>('duyurular');

  return (
    <IonPage>
      <IonContent className="dashboard-page">
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
                  <h2 className="cardholder-name">{mockUser.ad} {mockUser.soyad}</h2>
                </IonText>
                <IonText color="medium">
                  <p className="card-number">{mockUser.kartNo}</p>
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
              <h1 className="balance-amount">₺2,450.00</h1>
              <div className="balance-status">
                <span className="status-dot active"></span>
                <IonText color="medium">
                  <span className="status-text">Aktif</span>
                </IonText>
              </div>
            </div>

            {/* İndirim Oranları */}
            {mockUser.indirimler && mockUser.indirimler.length > 0 && (
              <div className="indirim-section-bottom">
                <IonText color="medium">
                  <p className="indirim-label">Tanımlı İndirimler</p>
                </IonText>
                <div className="indirim-list">
                  {mockUser.indirimler.map((indirim, index) => (
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
                {mockDuyurular.map(duyuru => (
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
                {mockIslemler.slice(0, 3).map(islem => (
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
                {mockIslemler.length >= 3 && (
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
