import React, { useRef } from 'react';
import {
  IonContent,
  IonPage,
  IonCard,
  IonCardContent,
  IonButton,
  IonIcon,
  IonText,
  IonSpinner
} from '@ionic/react';
import { downloadOutline } from 'ionicons/icons';
import { useHistory, useLocation } from 'react-router-dom';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import './IslemDetayPage.css';

interface Islem {
  id: number;
  tarih: string;
  tur: string;
  hastane: string;
  doktor: string;
  tutar: string;
  durum: 'tamamlandi' | 'beklemede';
  detay: string;
  indirimOrani?: number;
  indirimTutari?: number;
  toplamTutar?: number;
}

const IslemDetayPage: React.FC = () => {
  // const history = useHistory();
  const location = useLocation<{ islem: Islem }>();
  const islem = location.state?.islem;
  const contentRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = React.useState(false);

  if (!islem) {
    return null;
  }

  const handleDownloadReport = async () => {
    if (!contentRef.current) return;
    
    setIsDownloading(true);
    try {
      // Sayfayı canvas'a çevir
      const canvas = await html2canvas(contentRef.current, {
        allowTaint: true,
        useCORS: true,
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false
      });

      // Canvas'tan PDF oluştur
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgWidth = 210; // A4 genişliği (mm)
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const imgData = canvas.toDataURL('image/png');

      let heightLeft = imgHeight;
      let position = 0;

      // Çok sayfalı PDF için
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= 297; // A4 yüksekliği (mm)

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= 297;
      }

      // PDF'i indir
      const filename = `Islem_Raporu_${islem.id}_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(filename);

      console.log('Rapor başarıyla indirildi:', filename);
    } catch (error) {
      console.error('PDF indirme hatası:', error);
      alert('Rapor indirilirken bir hata oluştu. Lütfen tekrar deneyiniz.');
    } finally {
      setIsDownloading(false);
    }
  };

  const history = useHistory();
  const handleBack = () => history.push('/islemler');

  // İndirim hesaplamaları
  const toplamTutar = islem.toplamTutar || parseFloat(islem.tutar.replace(/[^0-9.-]/g, '')) || 0;
  let uygulananIndirim = 0;
  let indirimTuru = '';
  let hasIndirim = false;

  if (islem.indirimOrani && islem.indirimOrani > 0) {
    uygulananIndirim = toplamTutar * (islem.indirimOrani / 100);
    indirimTuru = `%${islem.indirimOrani} Oranında İndirim Uygulandı`;
    hasIndirim = true;
  } else if (islem.indirimTutari && islem.indirimTutari > 0) {
    uygulananIndirim = islem.indirimTutari;
    indirimTuru = `₺${islem.indirimTutari.toFixed(2)} Sabit İndirim Uygulandı`;
    hasIndirim = true;
  } else {
    indirimTuru = 'Bu işlemde indirim uygulanmamış';
  }

  const netOdenen = toplamTutar - uygulananIndirim;

  return (
    <IonPage>
      <div className="detay-header">
        <button className="back-btn" onClick={handleBack}>
          ← Geri
        </button>
        <h2 className="detay-title">{islem.tur}</h2>
      </div>
      <IonContent className="islem-detay-page">
        <div className="detay-container" ref={contentRef}>
          {/* İşlem Bilgileri */}
          <IonCard className="info-card">
            <IonCardContent>
              <h3 className="section-title">İşlem Bilgileri</h3>
              <div className="info-row">
                <span className="info-label">Tarih</span>
                <span className="info-value">{islem.tarih}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Doktor</span>
                <span className="info-value">{islem.doktor}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Hastane</span>
                <span className="info-value">{islem.hastane}</span>
              </div>
              <div className="info-row">
                <span className="info-label">İşlem Türü</span>
                <span className="info-value">{islem.tur}</span>
              </div>
              <div className="info-row highlight">
                <span className="info-label">Tutar</span>
                <span className="info-value amount">{islem.tutar}</span>
              </div>
            </IonCardContent>
          </IonCard>
          {/* Açıklama */}
          <IonCard className="description-card">
            <IonCardContent>
              <h3 className="section-title">Açıklama</h3>
              <p className="description-text">{islem.detay}</p>
            </IonCardContent>
          </IonCard>
          {/* İndirim Bilgileri */}
          <IonCard className="discount-card">
            <IonCardContent>
              <h3 className="section-title">İndirim Bilgileri</h3>
              <div className="discount-info">
                <p className="discount-type">{indirimTuru}</p>
                {hasIndirim && (
                  <>
                    <div className="discount-row">
                      <span className="discount-label">Toplam Tutar:</span>
                      <span className="discount-value">₺{toplamTutar.toFixed(2)}</span>
                    </div>
                    <div className="discount-row">
                      <span className="discount-label">İndirim Tutarı:</span>
                      <span className="discount-value discount-amount">-₺{uygulananIndirim.toFixed(2)}</span>
                    </div>
                    <div className="discount-row highlight">
                      <span className="discount-label">Net Ödenen:</span>
                      <span className="discount-value net-amount">₺{netOdenen.toFixed(2)}</span>
                    </div>
                  </>
                )}
              </div>
            </IonCardContent>
          </IonCard>
          {/* Rapor İndir Butonu */}
          {islem.durum === 'tamamlandi' && (
            <IonButton
              expand="block"
              className="download-button"
              onClick={handleDownloadReport}
              disabled={isDownloading}
            >
              {isDownloading ? (
                <>
                  <IonSpinner name="crescent" slot="start" />
                  İndiriliyor...
                </>
              ) : (
                <>
                  <IonIcon slot="start" icon={downloadOutline} />
                  Rapor İndir
                </>
              )}
            </IonButton>
          )}
          {/* Yardım Metni */}
          <div className="help-text">
            <IonText color="medium">
              <p>
                Bu işlemle ilgili sorularınız için destek ekibimizle iletişime geçebilirsiniz.
              </p>
            </IonText>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default IslemDetayPage;
