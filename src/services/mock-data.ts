import type { Tedavi } from '../types/tedavi'
import type { KullaniciProfil } from '../types/user'

export const mockProfil: KullaniciProfil = {
  id: 1,
  adSoyad: 'AHMET YILMAZ',
  tcKimlik: '12345678901',
  telefon: '+90 (532) 000 00 00',
  eposta: 'ahmet.yilmaz@example.com',
  kartNumarasi: '**** 1234',
  kartDurumu: 'aktif',
  sonKullanma: '12/2027',
  uyelikTarihi: '15 Ocak 2024',
  toplamTedavi: 5,
  buAyTedavi: 3
}

export const mockTedaviler: Tedavi[] = [
  {
    id: 1,
    ad: 'Kardiyoloji Kontrolü',
    tarih: '12 Kasım 2025',
    saat: '14:30',
    hastane: 'Bezmialem Vakıf Üniversitesi Hastanesi',
    klinik: 'Kardiyoloji Kliniği',
    doktor: 'Prof. Dr. Mehmet Öztürk',
    odemeBilgileri: {
      toplamTutar: 2500,
      indirimOrani: 25,
      indirimTutari: null,
      kartIleOdenen: 1875,
      odemeYontemi: 'Bezmialem Vakıf Kart',
      netOdenen: 1875
    },
    sonuc: 'Kontrol muayenesi sonuçları normal sınırlardadır...',
    notlar: 'Tansiyonunuzu düzenli ölçmeye devam ediniz.',
    raporUrl: '/reports/tedavi-1.pdf',
    durum: 'tamamlandi'
  },
  {
    id: 2,
    ad: 'Göz Muayenesi',
    tarih: '5 Kasım 2025',
    saat: '10:15',
    hastane: 'Bezmialem Vakıf Üniversitesi Hastanesi',
    klinik: 'Göz Hastalıkları Kliniği',
    doktor: 'Doç. Dr. Ayşe Demir',
    odemeBilgileri: {
      toplamTutar: 1800,
      indirimOrani: null,
      indirimTutari: 150,
      kartIleOdenen: 1650,
      odemeYontemi: 'Bezmialem Vakıf Kart',
      netOdenen: 1650
    },
    sonuc: 'Görme keskinliği normal. Gözlük reçetesi güncellenmedi.',
    raporUrl: '/reports/tedavi-2.pdf',
    durum: 'tamamlandi'
  },
  {
    id: 3,
    ad: 'Dahiliye Muayenesi',
    tarih: '28 Ekim 2025',
    saat: '16:00',
    hastane: 'Bezmialem Fatih Hastanesi',
    klinik: 'Dahiliye Kliniği',
    doktor: 'Uzm. Dr. Ali Kaya',
    odemeBilgileri: {
      toplamTutar: 2000,
      indirimOrani: 20,
      indirimTutari: null,
      kartIleOdenen: 1600,
      odemeYontemi: 'Bezmialem Vakıf Kart',
      netOdenen: 1600
    },
    sonuc: 'Genel sağlık durumu iyi. Vitamin desteği önerildi.',
    notlar: 'Vitamin D takviyesi başlandı. 3 ay sonra kontrol.',
    raporUrl: '/reports/tedavi-3.pdf',
    durum: 'tamamlandi'
  },
  {
    id: 4,
    ad: 'Ortopedi Muayenesi',
    tarih: '18 Ekim 2025',
    saat: '09:00',
    hastane: 'Bezmialem Vakıf Üniversitesi Hastanesi',
    klinik: 'Ortopedi Kliniği',
    doktor: 'Prof. Dr. Selim Arslan',
    odemeBilgileri: {
      toplamTutar: 3200,
      indirimOrani: null,
      indirimTutari: 200,
      kartIleOdenen: 3000,
      odemeYontemi: 'Bezmialem Vakıf Kart',
      netOdenen: 3000
    },
    sonuc: 'Diz ekleminde hafif dejenerasyon tespit edildi. Fizik tedavi önerildi.',
    notlar: '10 seans fizik tedavi planlandı.',
    raporUrl: '/reports/tedavi-4.pdf',
    durum: 'tamamlandi'
  },
  {
    id: 5,
    ad: 'Dermatoloji Kontrolü',
    tarih: '10 Ekim 2025',
    saat: '11:45',
    hastane: 'Bezmialem Fatih Hastanesi',
    klinik: 'Dermatoloji Kliniği',
    doktor: 'Uzm. Dr. Zeynep Şahin',
    odemeBilgileri: {
      toplamTutar: 1500,
      indirimOrani: 15,
      indirimTutari: null,
      kartIleOdenen: 1275,
      odemeYontemi: 'Bezmialem Vakıf Kart',
      netOdenen: 1275
    },
    sonuc: 'Cilt muayenesi normal. Koruyucu bakım önerileri verildi.',
    notlar: 'Güneş koruyucu kullanımına dikkat edilmesi.',
    raporUrl: '/reports/tedavi-5.pdf',
    durum: 'tamamlandi'
  }
]
