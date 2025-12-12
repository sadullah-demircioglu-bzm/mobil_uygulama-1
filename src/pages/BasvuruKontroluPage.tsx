import React, { useState, FormEvent } from 'react';
import { useHistory } from 'react-router-dom';
import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonButton,
  IonCard,
  IonCardContent,
  IonText,
  IonToast,
  IonSpinner
} from '@ionic/react';
import './BasvuruKontroluPage.css';
import { API } from '../services/apiEndpoints';
import { http } from '../services/api';
import type { ApplicationCheckRequest, ApplicationCheckResponse } from '../types/api';

interface BasvuruSonuc {
  durum: 'onaylandi' | 'beklemede' | 'reddedildi' | 'bulunamadi';
  mesaj: string;
  basvuruTarihi?: string;
  sonGuncelleme?: string;
  aciklama?: string;
}

const BasvuruKontroluPage: React.FC = () => {
  const [tcKimlik, setTcKimlik] = useState('');
  const [pasaportNo, setPasaportNo] = useState('');
  const [telefon, setTelefon] = useState('');
  const [loginType, setLoginType] = useState<'tc' | 'identity'>('tc');
  const [loading, setLoading] = useState(false);
  const [sonuc, setSonuc] = useState<BasvuruSonuc | null>(null);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const history = useHistory();
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    
    if (loginType === 'tc') {
      if (!tcKimlik) {
        setErrorMessage('Lütfen T.C. Kimlik No giriniz.');
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
    } else {
      if (!pasaportNo) {
        setErrorMessage('Lütfen Pasaport No giriniz.');
        setShowError(true);
        return;
      }
      if (pasaportNo.length < 6) {
        setErrorMessage('Pasaport No en az 6 karakter olmalıdır.');
        setShowError(true);
        return;
      }
    }

    if (!telefon) {
      setErrorMessage('Lütfen telefon numarası giriniz.');
      setShowError(true);
      return;
    }

    if (telefon.length !== 10) {
      setErrorMessage('Telefon numarası 10 haneli olmalıdır.');
      setShowError(true);
      return;
    }

    if (isSubmitting) return;
    setLoading(true);
    setIsSubmitting(true);
    setSonuc(null);

    try {
      const payload: ApplicationCheckRequest =
        loginType === 'tc'
          ? { tc_identity_no: tcKimlik, phone: telefon }
          : { identity_no: pasaportNo, phone: telefon };
      const resp = await http.post<ApplicationCheckResponse>(API.application.check, payload);
      setSonuc(resp as BasvuruSonuc);
    } catch (error: any) {
      setErrorMessage(error?.response?.data?.message || 'Sorgulama sırasında bir hata oluştu.');
      setShowError(true);
    } finally {
      setLoading(false);
      setIsSubmitting(false);
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
              Kart başvurunuzun durumunu öğrenmek için T.C. Kimlik No veya Pasaport No ve telefon numaranızı giriniz.
            </p>
          </IonText>

          <form onSubmit={handleSubmit} className="basvuru-form">
            <div className="radio-group">
              <label className={"radio-option" + (loginType === 'tc' ? ' active' : '')}>
                <input
                  type="radio"
                  name="login-type"
                  checked={loginType === 'tc'}
                  onChange={() => setLoginType('tc')}
                />
                T.C. Kimlik
              </label>
              <label className={"radio-option" + (loginType === 'identity' ? ' active' : '')}>
                <input
                  type="radio"
                  name="login-type"
                  checked={loginType === 'identity'}
                  onChange={() => setLoginType('identity')}
                />
                Diğer
              </label>
            </div>

            <div className="input-wrapper">
              {loginType === 'tc' ? (
                <>
                  <label htmlFor="tc-kimlik" className="input-label">T.C. Kimlik No</label>
                  <input
                    id="tc-kimlik"
                    type="text"
                    maxLength={11}
                    value={tcKimlik}
                    onChange={(e) => setTcKimlik(e.target.value.replace(/\D/g, ''))}
                    className="custom-input"
                    placeholder="11 haneli kimlik numaranız"
                    inputMode="numeric"
                  />
                </>
              ) : (
                <>
                  <label htmlFor="pasaport-no" className="input-label">Pasaport No</label>
                  <input
                    id="pasaport-no"
                    type="text"
                    value={pasaportNo}
                    onChange={(e) => setPasaportNo(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
                    className="custom-input"
                    placeholder="Pasaport numaranız"
                    autoComplete="off"
                  />
                </>
              )}
            </div>

            <div className="input-wrapper">
              <label htmlFor="telefon" className="input-label">Telefon Numarası</label>
              <input
                id="telefon"
                type="tel"
                maxLength={10}
                value={telefon}
                onChange={(e) => setTelefon(e.target.value.replace(/\D/g, ''))}
                className="custom-input"
                placeholder="5XX XXX XX XX"
                inputMode="numeric"
              />
            </div>

            <IonButton 
              expand="block" 
              type="submit"
              className="submit-button"
              disabled={loading || isSubmitting}
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

          <IonButton
            expand="block"
            color="medium"
            style={{ borderRadius: 10, height: 48, marginTop: 20, fontWeight: 600 }}
            onClick={() => history.push('/login')}
          >
            Vazgeç
          </IonButton>

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
