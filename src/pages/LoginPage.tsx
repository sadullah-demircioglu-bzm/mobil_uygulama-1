import React, { useState, FormEvent } from 'react';
import {
  IonContent,
  IonPage,
  IonButton,
  IonText,
  IonToast,
  IonImg
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import './LoginPage.css';
import { API } from '../services/apiEndpoints';
import { http } from '../services/api';
import type { LoginVerifyRequest, LoginVerifyResponse } from '../types/api';

interface LoginPageProps {
  onLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const history = useHistory();
  const [tcKimlik, setTcKimlik] = useState('');
  const [pasaportNo, setPasaportNo] = useState('');
  const [telefon, setTelefon] = useState('');
  const [loginType, setLoginType] = useState<'tc' | 'identity'>('tc');
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // T.C. Kimlik No doğrulama algoritması
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
    if (isSubmitting) return;
    
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

    try {
      setIsSubmitting(true);
      const payload: LoginVerifyRequest =
        loginType === 'tc'
          ? { tc_identity_no: tcKimlik, phone: telefon }
          : { identity_no: pasaportNo, phone: telefon };
      await http.post<LoginVerifyResponse>(API.auth.loginVerify, payload);
      history.push('/otp', { loginType, tcKimlik, pasaportNo, telefon });
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Giriş doğrulaması başarısız.';
      setErrorMessage(msg);
      setShowError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <IonPage>
      <IonContent className="ion-padding login-page">
        <div className="login-container">
          {/* Logo */}
          <div className="logo-container">
            <IonImg 
              src="/assets/logo-bezmialem.png" 
              alt="Bezmialem Vakıf Üniversitesi" 
              className="logo"
            />
          </div>

          {/* Başlık */}
          <IonText>
            <h1 className="title">BEZMİALEM VAKIF KART</h1>
          </IonText>

          {/* Form */}
          <form onSubmit={handleSubmit} className="login-form">
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

            {loginType === 'tc' ? (
              <div className="input-wrapper">
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
              </div>
            ) : (
              <div className="input-wrapper">
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
              </div>
            )}

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
              className="login-button"
              disabled={isSubmitting}
            >
              Giriş Yap
            </IonButton>

            <div className="link-container">
              <IonText>
                <p 
                  className="application-check-link"
                  onClick={() => history.push('/basvuru-kontrolu')}
                >
                  Başvuru Kontrolü
                </p>
              </IonText>
            </div>
          </form>

          {/* Error Toast */}
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

export default LoginPage;
