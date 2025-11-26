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

interface LoginPageProps {
  onLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const history = useHistory();
  const [tcKimlik, setTcKimlik] = useState('');
  const [telefon, setTelefon] = useState('');
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

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

  const handleSubmit = (e: FormEvent) => {
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

    // Mock: Backend'e doğrulama isteği gönderilecek ve OTP gönderilecek
    // TODO: API çağrısı yapılacak
    // OTP ekranına yönlendir
    history.push('/otp', { tcKimlik, telefon });
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
