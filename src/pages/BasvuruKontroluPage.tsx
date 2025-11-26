import React, { useState, FormEvent } from 'react';
import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonInput,
  IonButton,
  IonCard,
  IonCardContent,
  IonText,
  IonToast,
  IonSpinner
} from '@ionic/react';
import './BasvuruKontroluPage.css';

interface BasvuruSonuc {
  durum: 'onaylandi' | 'beklemede' | 'reddedildi' | 'bulunamadi';
  mesaj: string;
  basvuruTarihi?: string;
  sonGuncelleme?: string;
  aciklama?: string;
}

const BasvuruKontroluPage: React.FC = () => {
  const [tcKimlik, setTcKimlik] = useState('');
  const [telefon, setTelefon] = useState('');
  const [loading, setLoading] = useState(false);
  const [sonuc, setSonuc] = useState<BasvuruSonuc | null>(null);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const validateTCKimlik = (tc: string): boolean => {
    if (tc.length !== 11 || tc[0] === '0') return false;
    
    const digits = tc.split('').map(Number);
    const sum10 = digits.slice(0, 10).reduce((a, b) => a + b, 0);
    if (sum10 % 10 !== digits[10]) return false;
    
    const odd = digits[0] + digits[2] + digits[4] + digits[6] + digits[8];
    const even = digits[1] + digits[3] + digits[5] + digits[7];
    if (((odd * 7) - even) % 10 !== digits[9]) return false;
    
    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!tcKimlik || !telefon) {
      setErrorMessage('Lütfen tüm alanları doldurunuz.');
      setShowError(true);
      return;
    }

    if (tcKimlik.length !== 11) {
      setErrorMessage('T.C. Kimlik No 11 haneli olmalıdır.');
      setShowError(true);
      return;
    }

    if (!validateTCKimlik(tcKimlik)) {
      setErrorMessage('Geçersiz T.C. Kimlik No.');
      setShowError(true);
      return;
    }

    if (telefon.length !== 10) {
      setErrorMessage('Telefon numarası 10 haneli olmalıdır.');
      setShowError(true);
      return;
    }

    setLoading(true);
    setSonuc(null);

    try {
      // Mock API call - gerçek uygulamada backend'e istek atılacak
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock response
      const mockSonuc: BasvuruSonuc = {
        durum: 'onaylandi',
        mesaj: 'Başvurunuz onaylanmıştır.',
        basvuruTarihi: '15.11.2025',
        sonGuncelleme: '16.11.2025',
        aciklama: 'Kartınız hazırlanmaktadır. En kısa sürede tarafınıza ulaştırılacaktır.'
      };

      setSonuc(mockSonuc);
    } catch (error) {
      setErrorMessage('Sorgulama sırasında bir hata oluştu.');
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  const getDurumClass = (durum: string) => {
    switch(durum) {
      case 'onaylandi': return 'status-approved';
      case 'beklemede': return 'status-pending';
      case 'reddedildi': return 'status-rejected';
      default: return 'status-notfound';
    }
  };

  const getDurumText = (durum: string) => {
    switch(durum) {
      case 'onaylandi': return 'Onaylandı';
      case 'beklemede': return 'Beklemede';
      case 'reddedildi': return 'Reddedildi';
      default: return 'Bulunamadı';
    }
  };

  return (
    <IonPage>

      <IonContent className="ion-padding basvuru-kontrolu-page">
        <div className="basvuru-container">
          <IonText>
            
            <h2 className="page-title">Başvuru Durumunu Sorgula</h2>
            <p className="page-description">
              Kart başvurunuzun durumunu öğrenmek için T.C. Kimlik No ve telefon numaranızı giriniz.
            </p>
          </IonText>

          <form onSubmit={handleSubmit} className="basvuru-form">
            <IonInput
              label="T.C. Kimlik No"
              labelPlacement="stacked"
              type="text"
              maxlength={11}
              value={tcKimlik}
              onIonInput={(e) => setTcKimlik(e.detail.value?.replace(/\D/g, '') || '')}
              fill="outline"
              className="custom-input"
              placeholder="11 haneli kimlik numaranız"
            />

            <IonInput
              label="Telefon Numarası"
              labelPlacement="stacked"
              type="tel"
              maxlength={10}
              value={telefon}
              onIonInput={(e) => setTelefon(e.detail.value?.replace(/\D/g, '') || '')}
              fill="outline"
              className="custom-input"
              placeholder="5XX XXX XX XX"
            />

            <IonButton 
              expand="block" 
              type="submit"
              className="submit-button"
              disabled={loading}
            >
              {loading ? <IonSpinner name="crescent" /> : 'Sorgula'}
            </IonButton>
          </form>

          {sonuc && (
            <IonCard className="result-card">
              <IonCardContent>
                <div className={`status-badge ${getDurumClass(sonuc.durum)}`}>
                  {getDurumText(sonuc.durum)}
                </div>
                
                <IonText>
                  <h3 className="result-title">{sonuc.mesaj}</h3>
                </IonText>

                {sonuc.basvuruTarihi && (
                  <div className="result-detail">
                    <p className="detail-label">Başvuru Tarihi</p>
                    <p className="detail-value">{sonuc.basvuruTarihi}</p>
                  </div>
                )}

                {sonuc.sonGuncelleme && (
                  <div className="result-detail">
                    <p className="detail-label">Son Güncelleme</p>
                    <p className="detail-value">{sonuc.sonGuncelleme}</p>
                  </div>
                )}

                {sonuc.aciklama && (
                  <div className="result-description">
                    <IonText color="medium">
                      <p>{sonuc.aciklama}</p>
                    </IonText>
                  </div>
                )}
              </IonCardContent>
            </IonCard>
          )}

          <IonToast
            isOpen={showError}
            onDidDismiss={() => setShowError(false)}
            message={errorMessage}
            duration={3000}
            color="danger"
            position="top"
          />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default BasvuruKontroluPage;
