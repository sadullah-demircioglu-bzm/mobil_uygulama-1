import React, { useState, FormEvent } from 'react';
import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonCard,
  IonCardContent,
  IonInput,
  IonTextarea,
  IonButton,
  IonText,
  IonAccordionGroup,
  IonAccordion,
  IonItem,
  IonLabel,
  IonToast
} from '@ionic/react';
import './DestekPage.css';

const DestekPage: React.FC = () => {
  const [konu, setKonu] = useState('');
  const [mesaj, setMesaj] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (!konu || !mesaj) {
      return;
    }

    // Mock submit
    setShowSuccess(true);
    setKonu('');
    setMesaj('');
  };

  return (
    <IonPage>

      <IonContent className="ion-padding destek-page">
        {/* Destek Formu */}

        {/* SSS */}
        <div className="section">
          <IonText>
            <h3 className="section-title">Sık Sorulan Sorular</h3>
          </IonText>
          
          <IonAccordionGroup>
            <IonAccordion value="1">
              <IonItem slot="header">
                <IonLabel>Kartımı nasıl kullanabilirim?</IonLabel>
              </IonItem>
              <div className="accordion-content" slot="content">
                Bezmialem Vakıf Kart ile tüm poliklinik hizmetlerinde %40 indirimden yararlanabilirsiniz.
              </div>
            </IonAccordion>

            <IonAccordion value="2">
              <IonItem slot="header">
                <IonLabel>İndirim oranı nedir?</IonLabel>
              </IonItem>
              <div className="accordion-content" slot="content">
                Kart sahipleri tüm sağlık hizmetlerinde %40 indirim elde eder.
              </div>
            </IonAccordion>

            <IonAccordion value="3">
              <IonItem slot="header">
                <IonLabel>Şifremi unuttum ne yapmalıyım?</IonLabel>
              </IonItem>
              <div className="accordion-content" slot="content">
                Giriş ekranında "Şifremi Unuttum" linkine tıklayarak şifrenizi sıfırlayabilirsiniz.
              </div>
            </IonAccordion>

            <IonAccordion value="4">
              <IonItem slot="header">
                <IonLabel>Randevu nasıl alabilirim?</IonLabel>
              </IonItem>
              <div className="accordion-content" slot="content">
                Telefon (0212 XXX XX XX) veya online sistemimizden randevu alabilirsiniz.
              </div>
            </IonAccordion>
          </IonAccordionGroup>
        </div>

        <IonToast
          isOpen={showSuccess}
          onDidDismiss={() => setShowSuccess(false)}
          message="Mesajınız başarıyla gönderildi."
          duration={3000}
          color="success"
          position="top"
        />
      </IonContent>
    </IonPage>
  );
};

export default DestekPage;
