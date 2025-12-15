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
import { EP_MAP } from '../services/apiEndpoints';
import { http } from '../services/api';
import { logout as performLogout } from '../services/auth';
import type { PatientShowResponse } from '../types/api';
import { useEffectOnce } from '../hooks/useEffectOnce';
import { buildProtectedPayload } from '../services/otpContext';
import PhoneInput from '../components/PhoneInput';
import { getCountryCodeByPrefix } from '../utils/countryCodes';
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
  const [phoneCountryCode, setPhoneCountryCode] = useState('+90');
  const [phoneCountryIso2, setPhoneCountryIso2] = useState('TR');
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
  const [patient, setPatient] = useState<PatientShowResponse['patient'] | null>(null);
  const [summary, setSummary] = useState<PatientShowResponse['summary'] | null>(null);

  function formatPhone(raw?: string | null) {
    if (!raw) return '';
    const digits = raw.replace(/\D/g, '');
    if (digits.startsWith('90') && digits.length === 12) {
      return `+${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`;
    }
    if (digits.length > 4) {
      return `+${digits.slice(0, 2)} ${digits.slice(2)}`;
    }
    return digits;
  }

  function formatCardNumber(raw?: string | null) {
    if (!raw) return '';
    return raw.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();
  }

  function formatDate(iso?: string | null) {
    if (!iso) return '';
    const d = new Date(iso);
    return Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString('tr-TR');
  }

  useEffectOnce(() => {
    (async () => {
      try {
        const data = await http.post<PatientShowResponse>(EP_MAP.LOGIN, buildProtectedPayload({}), { retryMeta: { retry: 1 } });
        setPatient(data?.patient || null);
        setSummary(data?.summary || null);
        const formattedPhone = formatPhone(data?.patient?.phone_number);
        setCurrentPhone(formattedPhone);
        setCurrentEmail(data?.patient?.email || '');
      } catch {
        history.replace('/login');
      }
    })();
  });

  const totalTransactions = summary?.monthly_total_transactions?.reduce((sum, m) => sum + (m?.transaction_count || 0), 0) || 0;
  const currentMonthTransactions = summary?.monthly_total_transactions?.slice(-1)[0]?.transaction_count || 0;
  const remainingBalance = summary?.kpis?.remaining_balance?.current ?? summary?.monthly_balance?.slice(-1)[0]?.balance;
  const activeDiscountCount = summary?.active_discounts_details?.length || 0;
  const displayPhone = currentPhone || formatPhone(patient?.phone_number);
  const displayEmail = currentEmail || patient?.email || '';

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
      await http.post(EP_MAP.UPDATE_PROFILE, buildProtectedPayload({ old_password: oldPassword, new_password: newPassword }));
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
    const phoneDigits = newPhone.replace(/\D/g, '');
    if (phoneDigits.length < 6 || phoneDigits.length > 15) {
      setToastMessage('Telefon numarası 6-15 haneli olmalıdır.');
      setToastColor('danger');
      setShowToast(true);
      return;
    }
    try {
      setIsPhoneSubmitting(true);
      const normalizedPhone = `${phoneCountryCode.replace('+', '')}${phoneDigits}`;
      const country_iso2 = getCountryCodeByPrefix(phoneCountryCode)?.iso2 || phoneCountryIso2;
      await http.post(EP_MAP.UPDATE_PROFILE, buildProtectedPayload({ new_phone_number: normalizedPhone, country_iso2 }));
      setCurrentPhone(normalizedPhone);
      setToastMessage('Telefonunuz güncellendi.');
      setToastColor('success');
      setShowToast(true);
      setShowPhoneModal(false);
      resetPhoneModalState();
    } catch (e: any) {
      setToastMessage(e?.response?.data?.message || e?.message || 'Telefon güncelleme isteği başarısız.');
      setToastColor('danger');
      setShowToast(true);
    } finally {
      setIsPhoneSubmitting(false);
    }
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
    // OTP already validated globally; phone verification handled in handlePhoneContinue
  };

  const resetPhoneModalState = () => {
    setPhoneStep('phone');
    setOtpDigits(Array(6).fill(''));
    setNewPhone('');
    setPhoneCountryCode('+90');
    setPhoneCountryIso2('TR');
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
      await http.post(EP_MAP.UPDATE_PROFILE, buildProtectedPayload({ email : newEmail }));
      setCurrentEmail(newEmail);
      setToastMessage('E-posta adresiniz güncellendi.');
      setToastColor('success');
      setShowToast(true);
      setShowEmailModal(false);
      resetEmailModalState();
    } catch (e: any) {
      setToastMessage(e?.response?.data?.message || e?.message || 'E-posta güncelleme isteği başarısız.');
      setToastColor('danger');
      setShowToast(true);
    }
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
    // OTP already validated globally; email verification handled in handleEmailContinue
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
                  <div className="stat-value">{totalTransactions.toLocaleString('tr-TR')}</div>
                  <div className="stat-label">Toplam İşlem</div>
                </IonCardContent>
              </IonCard>
            </IonCol>
            <IonCol size="6">
              <IonCard className="stat-card">
                <IonCardContent>
                  <div className="stat-value">{currentMonthTransactions.toLocaleString('tr-TR')}</div>
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
                    <h3 className="info-value">{patient ? `${patient.first_name} ${patient.last_name}` : '-'}</h3>
                  </IonLabel>
                </IonItem>

                <IonItem>
                  <IonLabel>
                    <p className="info-label">T.C. Kimlik No</p>
                    <h3 className="info-value">{patient?.tc_identity_no || '-'}</h3>
                  </IonLabel>
                </IonItem>

                {patient?.card_number && (
                  <IonItem>
                    <IonLabel>
                      <p className="info-label">Kart Numarası</p>
                      <h3 className="info-value">{formatCardNumber(patient.card_number)}</h3>
                    </IonLabel>
                  </IonItem>
                )}

                {displayPhone && (
                  <IonItem>
                    <IonLabel>
                      <p className="info-label">Telefon</p>
                      <h3 className="info-value">{displayPhone}</h3>
                    </IonLabel>
                  </IonItem>
                )}

                {displayEmail && (
                  <IonItem>
                    <IonLabel>
                      <p className="info-label">E-posta</p>
                      <h3 className="info-value">{displayEmail}</h3>
                    </IonLabel>
                  </IonItem>
                )}

                {patient?.birth_date && (
                  <IonItem>
                    <IonLabel>
                      <p className="info-label">Doğum Tarihi</p>
                      <h3 className="info-value">{formatDate(patient.birth_date)}</h3>
                    </IonLabel>
                  </IonItem>
                )}

                {(patient?.city || patient?.district) && (
                  <IonItem>
                    <IonLabel>
                      <p className="info-label">İl / İlçe</p>
                      <h3 className="info-value">{[patient?.city, patient?.district].filter(Boolean).join(' / ')}</h3>
                    </IonLabel>
                  </IonItem>
                )}

                {patient?.address && (
                  <IonItem>
                    <IonLabel>
                      <p className="info-label">Adres</p>
                      <h3 className="info-value">{patient.address}</h3>
                    </IonLabel>
                  </IonItem>
                )}

                {typeof remainingBalance === 'number' && (
                  <IonItem>
                    <IonLabel>
                      <p className="info-label">Kalan Bakiye</p>
                      <h3 className="info-value">{remainingBalance.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</h3>
                    </IonLabel>
                  </IonItem>
                )}

                {activeDiscountCount > 0 && (
                  <IonItem>
                    <IonLabel>
                      <p className="info-label">Aktif İndirim</p>
                      <h3 className="info-value">{activeDiscountCount}</h3>
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
                <PhoneInput
                  phoneNumber={newPhone}
                  countryCode={phoneCountryCode}
                  onPhoneChange={setNewPhone}
                  onCountryCodeChange={(code) => {
                    setPhoneCountryCode(code);
                    const found = getCountryCodeByPrefix(code);
                    if (found?.iso2) setPhoneCountryIso2(found.iso2);
                  }}
                  placeholder="Telefon numarası"
                  maxLength={10}
                  disabled={isPhoneSubmitting}
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
