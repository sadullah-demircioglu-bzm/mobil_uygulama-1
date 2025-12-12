import React, { useEffect, useState } from 'react';
import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonText,
  IonButton,
  IonToast,
  IonImg
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import './OtpPage.css';
import { API } from '../services/apiEndpoints';
import { http } from '../services/api';
import type { OtpVerifyRequest, OtpVerifyResponse } from '../types/api';

interface OtpPageProps {
  onVerified: () => void;
}

const OtpPage: React.FC<OtpPageProps> = ({ onVerified }) => {
  const history = useHistory();
  const [code, setCode] = useState<string[]>(['', '', '', '', '', '']);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    const firstInput = document.getElementById('otp-0') as HTMLInputElement;
    firstInput?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    const onlyDigit = value.replace(/\D/g, '').slice(0, 1);
    const newCode = [...code];
    newCode[index] = onlyDigit;
    setCode(newCode);
    if (onlyDigit && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`) as HTMLInputElement;
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`) as HTMLInputElement;
      prevInput?.focus();
    }
  };

  const handleVerify = async () => {
    if (isVerifying) return;
    const otp = code.join('');
    if (otp.length !== 6) {
      setErrorMessage('Lütfen 6 haneli doğrulama kodunu giriniz.');
      setShowError(true);
      return;
    }

    try {
      setIsVerifying(true);
      // In case LoginPage pushed tc/telefon via state
      const navState = (history.location.state as any) || {};
      const payload: OtpVerifyRequest = {
        code: otp,
        phone: navState?.telefon,
        tc_identity_no: navState?.loginType === 'tc' ? navState?.tcKimlik : undefined,
        identity_no: navState?.loginType === 'identity' ? navState?.pasaportNo : undefined
      };
      const res = await http.post<OtpVerifyResponse>(API.auth.otpVerify, payload);
      if (res?.token) {
        localStorage.setItem('auth_token', res.token);
      }
      onVerified();
      history.replace('/dashboard');
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'OTP doğrulaması başarısız.';
      setErrorMessage(msg);
      setShowError(true);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <IonPage>
      <IonContent className="ion-padding otp-page">
        <div className="otp-container">
          <div className="logo-container">
            <IonImg src="/assets/logo-bezmialem.png" alt="Bezmialem" className="logo" />
          </div>

          <IonText>
            <h2 className="page-title">Tek Seferlik Şifre</h2>
            <p className="page-description">
              Lütfen telefonunuza gönderilen 6 haneli doğrulama kodunu giriniz.
            </p>
          </IonText>

          <div className="otp-inputs">
            {code.map((val, idx) => (
              <input
                key={idx}
                id={`otp-${idx}`}
                className="otp-input"
                inputMode="numeric"
                type="text"
                maxLength={1}
                value={val}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                autoComplete="off"
              />
            ))}
          </div>

          <IonButton expand="block" className="verify-button" onClick={handleVerify} disabled={isVerifying}>
            Doğrula ve Devam Et
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

export default OtpPage;
