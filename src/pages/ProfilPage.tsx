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
import { API } from '../services/apiEndpoints';
import { http } from '../services/api';
import { logout as performLogout } from '../services/auth';
import type { UserProfileResponse } from '../types/api';
import { useEffectOnce } from '../hooks/useEffectOnce';
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
  const [currentPhone, setCurrentPhone] = useState('');
  const [phoneStep, setPhoneStep] = useState<'phone' | 'otp'>('phone');
  const [otpDigits, setOtpDigits] = useState<string[]>(Array(6).fill(''));
  const otpRefs = useRef<HTMLInputElement[]>([]);
  const [newEmail, setNewEmail] = useState('');
  const [currentEmail, setCurrentEmail] = useState('');
  const [emailStep, setEmailStep] = useState<'email' | 'otp'>('email');
  const [emailOtpDigits, setEmailOtpDigits] = useState<string[]>(Array(6).fill(''));
  const emailOtpRefs = useRef<HTMLInputElement[]>([]);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastColor, setToastColor] = useState<'success' | 'danger'>('success');
  const [isPasswordSubmitting, setIsPasswordSubmitting] = useState(false);
  const [isPhoneSubmitting, setIsPhoneSubmitting] = useState(false);
  const [isPhoneVerifying, setIsPhoneVerifying] = useState(false);
  const [isEmailSubmitting, setIsEmailSubmitting] = useState(false);
  const [isEmailVerifying, setIsEmailVerifying] = useState(false);

  useEffectOnce(() => {
    (async () => {
      try {
        const profile = await http.get<UserProfileResponse>(API.user.profile, undefined, { retryMeta: { retry: 1 } });
        setCurrentPhone(profile?.telefon || '');
        setCurrentEmail(profile?.eposta || '');
      } catch {
        // ignore
      }
    })();
  });

  const handlePasswordChange = async () => {
    if (isPasswordSubmitting) return;
    if (!oldPassword || !newPassword || !confirmPassword) {
      setToastMessage('Lütfen tüm alanları doldurunuz.');
      setToastColor('danger');
      setShowToast(true);
      return;
    }

    if (newPassword !== confirmPassword) {
      setToastMessage('Yeni şifreler eşleşmiyor.');
      setToastColor('danger');
      setShowToast(true);
      return;
    }

    if (newPassword.length < 6) {
      setToastMessage('Şifre en az 6 karakter olmalıdır.');
      setToastColor('danger');
      setShowToast(true);
      return;
    }

    try {
      setIsPasswordSubmitting(true);
      await http.post(API.user.updatePassword, { oldPassword, newPassword });
      setToastMessage('Şifreniz başarıyla değiştirildi.');
      setToastColor('success');
      setShowToast(true);
      setShowPasswordModal(false);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (e: any) {
      setToastMessage(e?.response?.data?.message || 'Şifre güncelleme başarısız.');
      setToastColor('danger');
      setShowToast(true);
    } finally {
      setIsPasswordSubmitting(false);
    }
  };

  const handlePhoneContinue = async () => {
    if (isPhoneSubmitting) return;
    if (!newPhone) {
      setToastMessage('Lütfen telefon numaranızı giriniz.');
      setToastColor('danger');
      setShowToast(true);
      return;
    }
    if (newPhone.replace(/\D/g, '').length !== 10) {
      setToastMessage('Telefon numarası 10 haneli olmalıdır.');
      setToastColor('danger');
      setShowToast(true);
      return;
    }
    try {
      setIsPhoneSubmitting(true);
      await http.post(API.user.updatePhone, { phone: newPhone });
      setToastMessage('Doğrulama kodu gönderildi.');
      setToastColor('success');
      setShowToast(true);
      setPhoneStep('otp');
    } catch (e: any) {
      setToastMessage(e?.response?.data?.message || 'Telefon güncelleme isteği başarısız.');
      setToastColor('danger');
      setShowToast(true);
      return;
    }
    // Focus first OTP input after slight delay to ensure render
    setTimeout(() => {
      if (otpRefs.current[0]) otpRefs.current[0].focus();
    }, 50);
    setIsPhoneSubmitting(false);
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

  const handleVerifyPhone = async () => {
    if (isPhoneVerifying) return;
    const code = otpDigits.join('');
    if (code.length !== 6) {
      setToastMessage('Lütfen 6 haneli kodu giriniz.');
      setToastColor('danger');
      setShowToast(true);
      return;
    }
    try {
      setIsPhoneVerifying(true);
      await http.post(API.user.updatePhone, { phone: newPhone, code });
      setCurrentPhone(newPhone);
      setToastMessage('Telefonunuz güncellendi.');
      setToastColor('success');
      setShowToast(true);
      setShowPhoneModal(false);
      resetPhoneModalState();
    } catch (e: any) {
      setToastMessage(e?.response?.data?.message || 'Hatalı doğrulama kodu.');
      setToastColor('danger');
      setShowToast(true);
    } finally {
      setIsPhoneVerifying(false);
    }
  };

  const resetPhoneModalState = () => {
    setPhoneStep('phone');
    setOtpDigits(Array(6).fill(''));
    setNewPhone('');
  };

  const handleEmailContinue = async () => {
    if (isEmailSubmitting) return;
    if (!newEmail) {
      setToastMessage('Lütfen e-posta adresinizi giriniz.');
      setToastColor('danger');
      setShowToast(true);
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      setToastMessage('Geçerli bir e-posta adresi giriniz.');
      setToastColor('danger');
      setShowToast(true);
      return;
    }
    try {
      setIsEmailSubmitting(true);
      await http.post(API.user.updateEmail, { email: newEmail });
      setToastMessage('Doğrulama kodu gönderildi.');
      setToastColor('success');
      setShowToast(true);
      setEmailStep('otp');
    } catch (e: any) {
      setToastMessage(e?.response?.data?.message || 'E-posta güncelleme isteği başarısız.');
      setToastColor('danger');
      setShowToast(true);
    }
    setTimeout(() => {
      if (emailOtpRefs.current[0]) emailOtpRefs.current[0].focus();
    }, 50);
    setIsEmailSubmitting(false);
  };

  const handleEmailOtpInputChange = (index: number, value: string) => {
    const onlyDigit = value.replace(/\D/g, '').slice(0, 1);
    const nextDigits = [...emailOtpDigits];
    nextDigits[index] = onlyDigit;
    setEmailOtpDigits(nextDigits);
    if (onlyDigit && index < emailOtpRefs.current.length - 1) {
      emailOtpRefs.current[index + 1]?.focus();
    }
  };

  const handleEmailOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !emailOtpDigits[index] && index > 0) {
      emailOtpRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowLeft' && index > 0) {
      emailOtpRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowRight' && index < emailOtpRefs.current.length - 1) {
      emailOtpRefs.current[index + 1]?.focus();
    }
  };

  const handleVerifyEmail = async () => {
    if (isEmailVerifying) return;
    const code = emailOtpDigits.join('');
    if (code.length !== 6) {
      setToastMessage('Lütfen 6 haneli kodu giriniz.');
      setToastColor('danger');
      setShowToast(true);
      return;
    }
    try {
      setIsEmailVerifying(true);
      await http.post(API.user.updateEmail, { email: newEmail, code });
      setCurrentEmail(newEmail);
      setToastMessage('E-posta adresiniz güncellendi.');
      setToastColor('success');
      setShowToast(true);
      setShowEmailModal(false);
      resetEmailModalState();
    } catch (e: any) {
      setToastMessage(e?.response?.data?.message || 'Hatalı doğrulama kodu.');
      setToastColor('danger');
      setShowToast(true);
    } finally {
      setIsEmailVerifying(false);
    }
  };

  const resetEmailModalState = () => {
    setEmailStep('email');
    setEmailOtpDigits(Array(6).fill(''));
    setNewEmail('');
  };

  const handleLogout = async () => {
    await performLogout(true);
    onLogout();
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
                    <h3 className="info-value">{/* Ad Soyad sunucudan geliyorsa gösterilir */}</h3>
                  </IonLabel>
                </IonItem>

                <IonItem>
                  <IonLabel>
                    <p className="info-label">T.C. Kimlik No</p>
                    <h3 className="info-value">{/* T.C. Kimlik sunucudan geliyorsa gösterilir */}</h3>
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

                {currentEmail && (
                  <IonItem>
                    <IonLabel>
                      <p className="info-label">E-posta</p>
                      <h3 className="info-value">{currentEmail}</h3>
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

        <IonModal
          isOpen={showEmailModal}
          onDidDismiss={() => {
            setShowEmailModal(false);
            resetEmailModalState();
          }}
        >
          <IonHeader>
            <IonToolbar>
              <IonTitle>E-posta Değiştir</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding phoneModal__content">
            {emailStep === 'email' && (
              <div className="phoneModal__step phoneModal__stepPhone">
                <IonInput
                  label="Yeni E-posta"
                  labelPlacement="stacked"
                  type="email"
                  value={newEmail}
                  onIonInput={(e) => setNewEmail(e.detail.value || '')}
                  className="custom-input"
                  placeholder="ornek@eposta.com"
                />
                <IonButton expand="block" className="primary-button" onClick={handleEmailContinue}>Devam Et</IonButton>
                <IonButton
                  expand="block"
                  fill="clear"
                  onClick={() => {
                    setShowEmailModal(false);
                    resetEmailModalState();
                  }}
                >Vazgeç</IonButton>
              </div>
            )}
            {emailStep === 'otp' && (
              <div className="phoneModal__step phoneModal__stepOtp">
                <p className="phoneModal__instruction">E-posta adresinize gönderilen 6 haneli kodu giriniz.</p>
                <div className="phoneModal__otpInputs">
                  {emailOtpDigits.map((d, i) => (
                    <input
                      key={i}
                      ref={(el) => { if (el) emailOtpRefs.current[i] = el; }}
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      className="phoneModal__otpInput"
                      value={d}
                      onChange={(e) => handleEmailOtpInputChange(i, e.target.value)}
                      onKeyDown={(e) => handleEmailOtpKeyDown(i, e)}
                    />
                  ))}
                </div>
                <IonButton expand="block" className="primary-button" onClick={handleVerifyEmail}>Doğrula ve Güncelle</IonButton>
                <IonButton
                  expand="block"
                  fill="clear"
                  onClick={() => {
                    setShowEmailModal(false);
                    resetEmailModalState();
                  }}
                >Vazgeç</IonButton>
              </div>
            )}
          </IonContent>
        </IonModal>

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={2500}
          position="top"
          color={toastColor}
        />
      </IonContent>
    </IonPage>
  );
};

export default ProfilPage;
