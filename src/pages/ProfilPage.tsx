import React, { useState, useRef } from 'react';
import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonCard,
  IonCardContent,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonText,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
  IonModal,
  IonInput,
  IonToast
} from '@ionic/react';
import { keyOutline, callOutline, mailOutline, chevronForwardOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { mockUser } from '../services/mockData';
import './ProfilPage.css';

interface ProfilPageProps {
  onLogout: () => void;
}

const ProfilPage: React.FC<ProfilPageProps> = ({ onLogout }) => {
  const history = useHistory();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [newPhone, setNewPhone] = useState('');
  const [currentPhone, setCurrentPhone] = useState(mockUser.telefon || '');
  const [phoneStep, setPhoneStep] = useState<'phone' | 'otp'>('phone');
  const [otpDigits, setOtpDigits] = useState<string[]>(Array(6).fill(''));
  const otpRefs = useRef<HTMLInputElement[]>([]);
  const [newEmail, setNewEmail] = useState('');

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handlePasswordChange = () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      setToastMessage('Lütfen tüm alanları doldurunuz.');
      setShowToast(true);
      return;
    }

    if (newPassword !== confirmPassword) {
      setToastMessage('Yeni şifreler eşleşmiyor.');
      setShowToast(true);
      return;
    }

    if (newPassword.length < 6) {
      setToastMessage('Şifre en az 6 karakter olmalıdır.');
      setShowToast(true);
      return;
    }

    setToastMessage('Şifreniz başarıyla değiştirildi.');
    setShowToast(true);
    setShowPasswordModal(false);
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handlePhoneContinue = () => {
    if (!newPhone) {
      setToastMessage('Lütfen telefon numaranızı giriniz.');
      setShowToast(true);
      return;
    }
    if (newPhone.replace(/\D/g, '').length !== 10) {
      setToastMessage('Telefon numarası 10 haneli olmalıdır.');
      setShowToast(true);
      return;
    }
    setToastMessage('Doğrulama kodu gönderildi.');
    setShowToast(true);
    setPhoneStep('otp');
    // Focus first OTP input after slight delay to ensure render
    setTimeout(() => {
      if (otpRefs.current[0]) otpRefs.current[0].focus();
    }, 50);
  };

  const handleOtpInputChange = (index: number, value: string) => {
    const onlyDigit = value.replace(/\D/g, '').slice(0, 1);
    const nextDigits = [...otpDigits];
    nextDigits[index] = onlyDigit;
    setOtpDigits(nextDigits);
    if (onlyDigit && index < otpRefs.current.length - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowLeft' && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowRight' && index < otpRefs.current.length - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleVerifyPhone = () => {
    const code = otpDigits.join('');
    if (code.length !== 6) {
      setToastMessage('Lütfen 6 haneli kodu giriniz.');
      setShowToast(true);
      return;
    }
    if (code === '123456') {
      setCurrentPhone(newPhone);
      setToastMessage('Telefonunuz güncellendi.');
      setShowToast(true);
      setShowPhoneModal(false);
      resetPhoneModalState();
    } else {
      setToastMessage('Hatalı doğrulama kodu.');
      setShowToast(true);
    }
  };

  const resetPhoneModalState = () => {
    setPhoneStep('phone');
    setOtpDigits(Array(6).fill(''));
    setNewPhone('');
  };

  const handleEmailChange = () => {
    if (!newEmail) {
      setToastMessage('Lütfen e-posta adresinizi giriniz.');
      setShowToast(true);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      setToastMessage('Geçerli bir e-posta adresi giriniz.');
      setShowToast(true);
      return;
    }

    setToastMessage('E-posta adresiniz başarıyla güncellendi.');
    setShowToast(true);
    setShowEmailModal(false);
    setNewEmail('');
  };

  const handleLogout = () => {
    localStorage.removeItem('bezmialem_auth');
    onLogout();
    history.replace('/login');
  };

  return (
    <IonPage>

      <IonContent className="ion-padding profil-page">

        {/* İstatistikler */}
        <IonGrid className="stats-grid">
          <IonRow>
            <IonCol size="6">
              <IonCard className="stat-card">
                <IonCardContent>
                  <div className="stat-value">12</div>
                  <div className="stat-label">Toplam Tedavi</div>
                </IonCardContent>
              </IonCard>
            </IonCol>
            <IonCol size="6">
              <IonCard className="stat-card">
                <IonCardContent>
                  <div className="stat-value">3</div>
                  <div className="stat-label">Bu Ay</div>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>

        {/* Kişisel Bilgiler */}
        <div className="section">
          <IonText>
            <h3 className="section-title">Kişisel Bilgiler</h3>
          </IonText>
          
          <IonCard>
            <IonCardContent>
              <IonList lines="none">

                <IonItem>
                  <IonLabel>
                    <p className="info-label">Ad Soyad</p>
                    <h3 className="info-value">{mockUser.ad} {mockUser.soyad}</h3>
                  </IonLabel>
                </IonItem>

                <IonItem>
                  <IonLabel>
                    <p className="info-label">T.C. Kimlik No</p>
                    <h3 className="info-value">{mockUser.tcKimlik}</h3>
                  </IonLabel>
                </IonItem>

                {currentPhone && (
                  <IonItem>
                    <IonLabel>
                      <p className="info-label">Telefon</p>
                      <h3 className="info-value">{currentPhone}</h3>
                    </IonLabel>
                  </IonItem>
                )}

                {mockUser.eposta && (
                  <IonItem>
                    <IonLabel>
                      <p className="info-label">E-posta</p>
                      <h3 className="info-value">{mockUser.eposta}</h3>
                    </IonLabel>
                  </IonItem>
                )}
              </IonList>
            </IonCardContent>
          </IonCard>
        </div>

        {/* Hesap Ayarları */}
        <div className="section">
          <IonText>
            <h3 className="section-title">Hesap Ayarları</h3>
          </IonText>

          <IonCard>
            <IonCardContent>
              <IonList lines="full">
                <IonItem button detail onClick={() => setShowPhoneModal(true)}>
                  <IonIcon slot="start" icon={callOutline} />
                  <IonLabel>Telefon Değiştir</IonLabel>
                </IonItem>
                <IonItem button detail onClick={() => setShowEmailModal(true)}>
                  <IonIcon slot="start" icon={mailOutline} />
                  <IonLabel>E-posta Değiştir</IonLabel>
                </IonItem>
              </IonList>
            </IonCardContent>
          </IonCard>
        </div>

        {/* Çıkış Yap */}
        <IonButton 
          expand="block" 
          fill="outline"
          color="danger"
          onClick={handleLogout}
          className="logout-button"
        >
          Çıkış Yap
        </IonButton>

        {/* Modals */}
        <IonModal isOpen={showPasswordModal} onDidDismiss={() => setShowPasswordModal(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Şifre Değiştir</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <IonInput
              label="Mevcut Şifre"
              labelPlacement="stacked"
              type="password"
              value={oldPassword}
              onIonInput={(e) => setOldPassword(e.detail.value || '')}
              className="custom-input"
            />
            <IonInput
              label="Yeni Şifre"
              labelPlacement="stacked"
              type="password"
              value={newPassword}
              onIonInput={(e) => setNewPassword(e.detail.value || '')}
              className="custom-input"
            />
            <IonInput
              label="Yeni Şifre (Tekrar)"
              labelPlacement="stacked"
              type="password"
              value={confirmPassword}
              onIonInput={(e) => setConfirmPassword(e.detail.value || '')}
              className="custom-input"
            />
            <IonButton expand="block" className="primary-button" onClick={handlePasswordChange}>Kaydet</IonButton>
            <IonButton expand="block" fill="clear" onClick={() => setShowPasswordModal(false)}>Vazgeç</IonButton>
          </IonContent>
        </IonModal>

        <IonModal
          isOpen={showPhoneModal}
          onDidDismiss={() => {
            setShowPhoneModal(false);
            resetPhoneModalState();
          }}
        >
          <IonHeader>
            <IonToolbar>
              <IonTitle>Telefon Değiştir</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding phoneModal__content">
            {phoneStep === 'phone' && (
              <div className="phoneModal__step phoneModal__stepPhone">
                <IonInput
                  label="Yeni Telefon Numarası"
                  labelPlacement="stacked"
                  type="tel"
                  maxlength={10}
                  value={newPhone}
                  onIonInput={(e) => setNewPhone((e.detail.value || '').replace(/\D/g, ''))}
                  className="custom-input"
                  placeholder="5XX XXX XX XX"
                />
                <IonButton expand="block" className="primary-button" onClick={handlePhoneContinue}>Devam Et</IonButton>
                <IonButton
                  expand="block"
                  fill="clear"
                  onClick={() => {
                    setShowPhoneModal(false);
                    resetPhoneModalState();
                  }}
                >Vazgeç</IonButton>
              </div>
            )}
            {phoneStep === 'otp' && (
              <div className="phoneModal__step phoneModal__stepOtp">
                <p className="phoneModal__instruction">SMS ile gönderilen 6 haneli kodu giriniz.</p>
                <div className="phoneModal__otpInputs">
                  {otpDigits.map((d, i) => (
                    <input
                      key={i}
                      ref={(el) => { if (el) otpRefs.current[i] = el; }}
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      className="phoneModal__otpInput"
                      value={d}
                      onChange={(e) => handleOtpInputChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    />
                  ))}
                </div>
                <IonButton expand="block" className="primary-button" onClick={handleVerifyPhone}>Doğrula ve Güncelle</IonButton>
                <IonButton
                  expand="block"
                  fill="clear"
                  onClick={() => {
                    setShowPhoneModal(false);
                    resetPhoneModalState();
                  }}
                >Vazgeç</IonButton>
              </div>
            )}
          </IonContent>
        </IonModal>

        <IonModal isOpen={showEmailModal} onDidDismiss={() => setShowEmailModal(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>E-posta Değiştir</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <IonInput
              label="Yeni E-posta"
              labelPlacement="stacked"
              type="email"
              value={newEmail}
              onIonInput={(e) => setNewEmail(e.detail.value || '')}
              className="custom-input"
              placeholder="ornek@eposta.com"
            />
            <IonButton expand="block" className="primary-button" onClick={handleEmailChange}>Kaydet</IonButton>
            <IonButton expand="block" fill="clear" onClick={() => setShowEmailModal(false)}>Vazgeç</IonButton>
          </IonContent>
        </IonModal>

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={2500}
          position="top"
          color="success"
        />
      </IonContent>
    </IonPage>
  );
};

export default ProfilPage;
