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

            <IonAccordion value="4">
              <IonItem slot="header">
                <IonLabel>Randevu nasıl alabilirim?</IonLabel>
              </IonItem>
              <div className="accordion-content" slot="content">
                Telefon (0212 453 17 00) veya online sistemimizden randevu alabilirsiniz.
              </div>
            </IonAccordion>

            <IonAccordion value="5">
              <IonItem slot="header">
                <IonLabel>Kartı nasıl alırım?</IonLabel>
              </IonItem>
              <div className="accordion-content" slot="content">
                Başvurunuzu uygulama üzerinden tamamlayıp onaylandığında kartınız dijital olarak tanımlanır; fiziksel kart gerekmez.
              </div>
            </IonAccordion>

            <IonAccordion value="6">
              <IonItem slot="header">
                <IonLabel>Bakiye nasıl yüklenir?</IonLabel>
              </IonItem>
              <div className="accordion-content" slot="content">
                Hesabınıza aktarılan tutarlar uygulamada otomatik görünür; harcamalarınızı ve kalan bakiyeyi "İşlemler" ve "Profil" sayfalarından takip edebilirsiniz.
              </div>
            </IonAccordion>

            <IonAccordion value="7">
              <IonItem slot="header">
                <IonLabel>İndirim kodlarım nerede?</IonLabel>
              </IonItem>
              <div className="accordion-content" slot="content">
                Aktif indirimleriniz "Profil" ve "Dashboard" sayfalarında listelenir; ilgili poliklinik işlemlerinde otomatik uygulanır.
              </div>
            </IonAccordion>

            <IonAccordion value="8">
              <IonItem slot="header">
                <IonLabel>Başvurum ne kadar sürer?</IonLabel>
              </IonItem>
              <div className="accordion-content" slot="content">
                Başvurular genellikle 1-2 iş günü içinde değerlendirilir; durumunuzu "Başvuru Kontrolü" ekranından görebilirsiniz.
              </div>
            </IonAccordion>

            <IonAccordion value="9">
              <IonItem slot="header">
                <IonLabel>Kayıp/çalıntı durumda ne yapmalıyım?</IonLabel>
              </IonItem>
              <div className="accordion-content" slot="content">
                Destek üzerinden bize bildirirseniz kartınız anında güvenli moda alınır ve yenisi dijital olarak tanımlanır.
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
