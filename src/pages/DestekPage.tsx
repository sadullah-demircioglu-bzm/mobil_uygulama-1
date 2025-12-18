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
                <IonLabel>Kartı Nasıl Alırım?</IonLabel>
              </IonItem>
              <div className="accordion-content" slot="content">
                  Bezmialem Vakıf Üniversitesi Hasta Kayıt Bankolarından bu karta başvurunuzu sağlayabilirsiniz. Sizlere verilecek websitesi linkine girerek kart başvuru formunu doldurarak talebinizi oluşturabilirsiniz. Hakkınızda yapılacak mali durum araştırmasına göre süreç onaylanacak ve kart temini tarafınıza sağlanacaktır.              </div>
            </IonAccordion>
 
            <IonAccordion value="2">
              <IonItem slot="header">
                <IonLabel>Kartımı nasıl kullanabilirim?</IonLabel>
              </IonItem>
              <div className="accordion-content" slot="content">
                Bezmiâlem Vakıf Üniversitesi Hastanesi Hasta Kayıt Bankolarında bu kartı göstererek sistemden yapılacak kontroller sonrası üzerinizde tanımlı bakiye ve indirim hakkınızı kullanabilirsiniz. Adınıza tanımlı hesabınızdaki miktara göre alacağınız sağlık hizmeti faturalanacaktır. Bu kart için verilen süre içerisinde aktif olarak kullanabileceksiniz.
              </div>
            </IonAccordion>
 
            <IonAccordion value="4">
              <IonItem slot="header">
                <IonLabel>Bakiye Nedir?</IonLabel>
              </IonItem>
              <div className="accordion-content" slot="content">
                Bezmialem Vakıf Kart sisteminde tanımlı olan, sağlık hizmeti aldığınızda fatura edilecek meblağ üzerinden düşülecek nakit miktardır. Bu bakiyeyi size verilecek süre içerisinde istediğiniz miktarda kullanabilirsiniz.
              </div>
            </IonAccordion>
 
            <IonAccordion value="5">
              <IonItem slot="header">
                <IonLabel>İndirim Oranı Nedir?</IonLabel>
              </IonItem>
              <div className="accordion-content" slot="content">
                Bezmialem Vakıf Kart sisteminde tanımlı olan, sağlık hizmeti aldığınızda fatura edilecek meblağ üzerinden düşülecek yüzdelik orandır. Bu oranı size verilecek süre içerisinde kullanabilirsiniz.
              </div>
            </IonAccordion>
 
            <IonAccordion value="6">
              <IonItem slot="header">
                <IonLabel>Bakiye ve İndirim Oranı Nasıl Yüklenir?</IonLabel>
              </IonItem>
              <div className="accordion-content" slot="content">
                Bezmialem Vakıf Kart verilen kişilere belirlenen bakiye ve indirim oranı belirlenen periyotlarda otomatik olarak yüklenecektir.
              </div>
            </IonAccordion>
 
            <IonAccordion value="7">
              <IonItem slot="header">
                <IonLabel>Kayıp/ Çalıntı durumunda ne yapmalıyım?</IonLabel>
              </IonItem>
              <div className="accordion-content" slot="content">
                Bezmialem Vakıf Kart üzerinde belirtilen iletişim bilgileriyle kurum ile temasa geçebilirsiniz.
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
 
 