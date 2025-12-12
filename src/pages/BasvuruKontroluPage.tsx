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
import { formatTRDateTime } from '../utils/dateTime';
import './BasvuruKontroluPage.css';
import './OtpPage.css';
import { EP_MAP } from '../services/apiEndpoints';
import { http } from '../services/api';
import type { ApplicationCheckResponse, OtpAttemptData, OtpAttemptRequest } from '../types/api';
import { saveOtpContext, clearOtpContext, setCurrentOtp, buildProtectedPayload } from '../services/otpContext';

interface BasvuruSonuc {
  status: "pending" | "under_review" | "approved" | "rejected" | "patient";
  decision_notes: string;
  created_at?: string;
  updated_at?: string;
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
  const [otpSent, setOtpSent] = useState(false);
  const [otpDigits, setOtpDigits] = useState<string[]>(Array(6).fill(''));

  const validateTCKimlik = (tc: string): boolean => {
    return true
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
      const phone_number = telefon.startsWith('0') ? telefon : `0${telefon}`;
      const payload: OtpAttemptRequest =
        loginType === 'tc'
          ? { type: 'application', tc_identity_no: tcKimlik, phone_number }
          : { type: 'application', identity_no: pasaportNo, phone_number };
      clearOtpContext();
      setCurrentOtp('');
      const resp = await http.post<OtpAttemptData>(EP_MAP.OTP_ATTEMPT, payload);
      const otp_cipher = (resp as any)?.otp_cipher || (resp as any)?.otp;
      if (!otp_cipher) throw new Error('OTP bilgisi alınamadı.');
      saveOtpContext({
        otp_cipher,
        phone_number,
        tc_identity_no: payload.tc_identity_no,
        identity_no: payload.identity_no
      });
      setOtpSent(true);
      setErrorMessage('Doğrulama kodu gönderildi. Lütfen OTP giriniz.');
      setShowError(true);
    } catch (error: any) {
      setErrorMessage(error?.response?.data?.message || error?.message || 'Sorgulama sırasında bir hata oluştu.');
      setShowError(true);
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  const handleOtpInputChange = (index: number, value: string) => {
    const onlyDigit = value.replace(/\D/g, '').slice(0, 1);
    const next = [...otpDigits];
    next[index] = onlyDigit;
    setOtpDigits(next);
  };

  const handleVerifyOtpAndCheck = async () => {
    const otp = otpDigits.join('');
    if (otp.length !== 6) {
      setErrorMessage('Lütfen 6 haneli OTP giriniz.');
      setShowError(true);
      return;
    }

    try {
      setCurrentOtp(otp);
      const resp = await http.post<ApplicationCheckResponse>(EP_MAP.CHECK_APPLICATION, buildProtectedPayload({}));
      setSonuc(resp as BasvuruSonuc);
    } catch (error: any) {
      setErrorMessage(error?.response?.data?.message || error?.message || 'Doğrulama başarısız.');
      setShowError(true);
      clearOtpContext();
      history.replace('/login');
    }
  };

  const getDurumClass = (durum: string) => {
    switch(durum) {
      case 'approved': return 'status-approved';
      case 'pending': return 'status-pending';
      case 'under_review': return 'status-info';
      case 'rejected': return 'status-rejected';
      case 'patient': return 'status-approved';
      default: return 'status-notfound';
    }
  };

  const getDurumText = (durum: string) => {
    switch(durum) {
      case 'approved': return 'Onaylandı';
      case 'pending': return 'Beklemede';
      case 'rejected': return 'Reddedildi';
      case 'under_review': return 'İnceleniyor';
      case 'patient': return 'Hasta Kabul Edildi';
      default: return 'Bulunamadı';
    }
  };

  return (
    <IonPage>

      <IonContent className="ion-padding basvuru-kontrolu-page">
        <div className="basvuru-container">
          <IonText>
            
            <h2 className="page-title">Başvuru Durumunu Sorgula</h2>
            
          </IonText>

          <form onSubmit={handleSubmit} className="basvuru-form">
            {!otpSent && (
              <>
                <p className="page-description">
                  Kart başvurunuzun durumunu öğrenmek için T.C. Kimlik No veya Pasaport No ve telefon numaranızı giriniz.
                </p>
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
            </>
            )}

          {(otpSent && !sonuc) && (
            
            <div className="otp-section">
              <p className="page-description">
                  Cep telefonunuza gönderilen 6 haneli doğrulama kodunu giriniz.
                </p>
              <div className="otp-inputs">
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    className="otp-input"
                    inputMode="numeric"
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpInputChange(idx, e.target.value)}
                    autoComplete="one-time-code"
                  />
                ))}
              </div>
              <IonButton
                expand="block"
                type="button"
                className="submit-button"
                disabled={loading || isSubmitting}
                onClick={handleVerifyOtpAndCheck}
              >
                OTP ile Doğrula
              </IonButton>
            </div>
          )}
          </form>

          {sonuc && (
            <IonCard className="result-card">
              <IonCardContent>
                <div className={`status-badge ${getDurumClass(sonuc.status)}`}>
                  {getDurumText(sonuc.status)}
                </div>
                {sonuc.created_at && (
                  <div className="result-detail">
                    <p className="detail-label">Başvuru Tarihi</p>
                    <p className="detail-value">{formatTRDateTime(sonuc.created_at)}</p>
                  </div>
                )}

                {sonuc.updated_at && (
                  <div className="result-detail">
                    <p className="detail-label">Son Güncelleme</p>
                    <p className="detail-value">{formatTRDateTime(sonuc.updated_at)}</p>
                  </div>
                )}

                {sonuc.decision_notes && (
                  <div className="result-description">
                    <IonText color="medium">
                      <p>{sonuc.decision_notes}</p>
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
            Geri Dön
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
