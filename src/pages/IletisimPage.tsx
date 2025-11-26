import React from 'react';
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
  IonIcon,
  IonText
} from '@ionic/react';
import {
  callOutline,
  mailOutline,
  locationOutline,
  logoFacebook,
  logoTwitter,
  logoInstagram
} from 'ionicons/icons';
import './IletisimPage.css';

const IletisimPage: React.FC = () => {
  return (
    <IonPage>
      <IonContent className="ion-padding iletisim-page">
        {/* İletişim Bilgileri */}
        <div className="section">
          <IonText>
            <h3 className="section-title">İletişim Bilgileri</h3>
          </IonText>
          
          <IonCard>
            <IonCardContent>
              <IonList lines="none">
                <IonItem>
                  <IonIcon icon={callOutline} slot="start" className="contact-icon" />
                  <IonLabel>
                    <h3>Telefon</h3>
                    <p>0212 453 17 00</p>
                  </IonLabel>
                </IonItem>

                <IonItem>
                  <IonIcon icon={mailOutline} slot="start" className="contact-icon" />
                  <IonLabel>
                    <h3>E-posta</h3>
                    <p>info@bezmialem.edu.tr</p>
                  </IonLabel>
                </IonItem>

                <IonItem>
                  <IonIcon icon={locationOutline} slot="start" className="contact-icon" />
                  <IonLabel>
                    <h3>Adres</h3>
                    <p>Adnan Menderes Bulvarı, Vatan Cad.<br />34093 Fatih/İstanbul</p>
                  </IonLabel>
                </IonItem>
              </IonList>
            </IonCardContent>
          </IonCard>
        </div>

        {/* Kampüsler */}
        <div className="section">
          <IonText>
            <h3 className="section-title">Kampüslerimiz</h3>
          </IonText>
          
          <IonCard className="campus-card">
            <IonCardContent>
              <h4 className="campus-name">Bezmialem Vakıf Üniversitesi Hastanesi</h4>
              <p className="campus-address">
                Adnan Menderes Bulvarı, Vatan Cad.<br />
                34093 Fatih/İstanbul
              </p>
            </IonCardContent>
          </IonCard>

          <IonCard className="campus-card">
            <IonCardContent>
              <h4 className="campus-name">Bezmialem Fatih Hastanesi</h4>
              <p className="campus-address">
                Millet Cad. No: 120<br />
                34104 Fatih/İstanbul
              </p>
            </IonCardContent>
          </IonCard>
        </div>

        {/* Sosyal Medya */}
        <div className="section">
          <IonText>
            <h3 className="section-title">Sosyal Medya</h3>
          </IonText>
          
          <div className="social-buttons">
            <IonIcon icon={logoFacebook} className="social-icon" />
            <IonIcon icon={logoTwitter} className="social-icon" />
            <IonIcon icon={logoInstagram} className="social-icon" />
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default IletisimPage;
