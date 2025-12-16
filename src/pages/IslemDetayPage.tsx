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
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useHistory, useLocation } from 'react-router-dom';
import { EP_MAP } from '../services/apiEndpoints';
import { http } from '../services/api';
import type { TransactionDetailResponse, TransactionsListResponse, TransactionListItem } from '../types/api';
import { useEffectOnce } from '../hooks/useEffectOnce';
import { buildProtectedPayload } from '../services/otpContext';
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
  const [fetchedIslem, setFetchedIslem] = React.useState<Islem | null>(null);

  const islemIdFromPath = (() => {
    const parts = window.location.pathname.split('/');
    const last = parts[parts.length - 1];
    const id = Number(last);
    return Number.isFinite(id) ? id : undefined;
  })();

  useEffectOnce(() => {
    if (!location.state?.islem && islemIdFromPath) {
      (async () => {
        try {
          const list = await http.post<TransactionsListResponse>(EP_MAP.TRANSACTIONS_LIST, buildProtectedPayload({ page: 1, limit: 50 }), { retryMeta: { retry: 1 } });
          const found = Array.isArray(list)
            ? (list as TransactionListItem[]).find((tx) => Number(tx.id) === islemIdFromPath)
            : null;
          if (found) setFetchedIslem(found as any);
        } catch (e) {
          // ignore, show minimal UI
        }
      })();
    }
  });

  const aktifIslem: Islem | null = islem || fetchedIslem || null;
  if (!aktifIslem) return null;

  const handleDownloadReport = async () => {
    if (!contentRef.current) return;
    try {
      setIsDownloading(true);
      const el = contentRef.current;
      // Use a white background for better contrast in PDF
      const canvas = await html2canvas(el, {
        scale: window.devicePixelRatio || 2,
        backgroundColor: '#ffffff',
        useCORS: true
      });
      const imgData = canvas.toDataURL('image/png');

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const imgProps = { width: canvas.width, height: canvas.height };
      const ratio = Math.min(pageWidth / imgProps.width, pageHeight / imgProps.height);
      const imgWidthMm = imgProps.width * ratio;
      const imgHeightMm = imgProps.height * ratio;
      const x = (pageWidth - imgWidthMm) / 2;
      const y = 10; // small top margin

      pdf.addImage(imgData, 'PNG', x, y, imgWidthMm, imgHeightMm);
      const filename = `islem_${aktifIslem.id}.pdf`;
      pdf.save(filename);
    } catch (e) {
      alert('PDF oluşturma sırasında bir hata oluştu.');
    } finally {
      setIsDownloading(false);
    }
  };

  const history = useHistory();
  const handleBack = () => history.push('/islemler');

  // İndirim hesaplamaları
  const toplamTutar = aktifIslem.toplamTutar || parseFloat(aktifIslem.tutar.replace(/[^0-9.-]/g, '')) || 0;
  let uygulananIndirim = 0;
  let indirimTuru = '';
  let hasIndirim = false;

  if (aktifIslem.indirimOrani && aktifIslem.indirimOrani > 0) {
    uygulananIndirim = toplamTutar * (islem.indirimOrani / 100);
    indirimTuru = `%${aktifIslem.indirimOrani} Oranında İndirim Uygulandı`;
    hasIndirim = true;
  } else if (aktifIslem.indirimTutari && aktifIslem.indirimTutari > 0) {
    uygulananIndirim = aktifIslem.indirimTutari;
    indirimTuru = `₺${aktifIslem.indirimTutari.toFixed(2)} Sabit İndirim Uygulandı`;
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
        <h2 className="detay-title">{aktifIslem.tur}</h2>
      </div>
      <IonContent className="islem-detay-page">
        <div className="detay-container" ref={contentRef}>
          {/* İşlem Bilgileri */}
          <IonCard className="info-card">
            <IonCardContent>
              <h3 className="section-title">İşlem Bilgileri</h3>
              <div className="info-row">
                <span className="info-label">Tarih</span>
                <span className="info-value">{aktifIslem.tarih}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Doktor</span>
                <span className="info-value">{aktifIslem.doktor}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Hastane</span>
                <span className="info-value">{aktifIslem.hastane}</span>
              </div>
              <div className="info-row">
                <span className="info-label">İşlem Türü</span>
                <span className="info-value">{aktifIslem.tur}</span>
              </div>
              <div className="info-row highlight">
                <span className="info-label">Tutar</span>
                <span className="info-value amount">{aktifIslem.tutar}</span>
              </div>
            </IonCardContent>
          </IonCard>
          {/* Açıklama */}
          <IonCard className="description-card">
            <IonCardContent>
              <h3 className="section-title">Açıklama</h3>
              <p className="description-text">{aktifIslem.detay}</p>
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
          {aktifIslem.durum === 'tamamlandi' && (
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
