import { Tedavi, TedaviDetay } from '../types/tedavi';
import { User } from '../types/user';

export const mockUser: User = {
  ad: 'AHMET',
  soyad: 'YILMAZ',
  tcKimlik: '12345678901',
  kartNo: '5432 1098 7654 3210',
  durum: 'Aktif',
  telefon: '0555 123 45 67',
  eposta: 'ahmet.yilmaz@example.com',
  indirimler: [
    { tur: 'Şehit/Gazi Yakını İndirimi', oran: 20 },
    { tur: 'Emekli İndirimi', oran: 10 }
  ]
};

export const mockTedaviler: Tedavi[] = [
  {
    id: 1,
    tarih: '12 Kasım 2025',
    hastane: 'Bezmialem Vakıf Üniversitesi Hastanesi',
    tur: 'Kardiyoloji Kontrolü',
    doktor: 'Prof. Dr. Mehmet Öztürk',
  },
  {
    id: 2,
    tarih: '5 Kasım 2025',
    hastane: 'Bezmialem Vakıf Üniversitesi Hastanesi',
    tur: 'Göz Muayenesi',
    doktor: 'Doç. Dr. Ayşe Demir',
  },
  {
    id: 3,
    tarih: '28 Ekim 2025',
    hastane: 'Bezmialem Fatih Hastanesi',
    tur: 'Dahiliye Muayenesi',
    doktor: 'Uzm. Dr. Ali Kaya',
  },
];

export const mockTedaviDetaylar: Record<number, TedaviDetay> = {
  1: {
    id: 1,
    ad: 'Kardiyoloji Kontrolü',
    tarih: '12 Kasım 2025',
    saat: '14:30',
    hastane: 'Bezmialem Vakıf Üniversitesi Hastanesi',
    klinik: 'Kardiyoloji Kliniği',
    doktor: 'Prof. Dr. Mehmet Öztürk',
    odemeBilgileri: {
      toplamTutar: 2500.00,
      indirimOrani: 25,
      indirimTutari: null,
      kartIleOdenen: 1875.00,
      odemeYontemi: 'Bezmialem Vakıf Kart',
      netOdenen: 1875.00
    },
    sonuc: 'Kontrol muayenesi sonuçları normal sınırlardadır. Mevcut tedaviye devam edilmesi önerilmektedir.',
    notlar: 'Tansiyonunuzu düzenli ölçmeye devam ediniz.',
    raporUrl: '/rapor-1.pdf'
  },
  2: {
    id: 2,
    ad: 'Göz Muayenesi',
    tarih: '5 Kasım 2025',
    saat: '10:15',
    hastane: 'Bezmialem Vakıf Üniversitesi Hastanesi',
    klinik: 'Göz Hastalıkları Kliniği',
    doktor: 'Doç. Dr. Ayşe Demir',
    odemeBilgileri: {
      toplamTutar: 1800.00,
      indirimOrani: null,
      indirimTutari: 150.00,
      kartIleOdenen: 1650.00,
      odemeYontemi: 'Bezmialem Vakıf Kart',
      netOdenen: 1650.00
    },
    sonuc: 'Görme keskinliği normal. Gözlük reçetesi güncellenmedi.',
    raporUrl: '/rapor-2.pdf'
  },
  3: {
    id: 3,
    ad: 'Dahiliye Muayenesi',
    tarih: '28 Ekim 2025',
    saat: '16:00',
    hastane: 'Bezmialem Fatih Hastanesi',
    klinik: 'Dahiliye Kliniği',
    doktor: 'Uzm. Dr. Ali Kaya',
    odemeBilgileri: {
      toplamTutar: 2000.00,
      indirimOrani: 20,
      indirimTutari: null,
      kartIleOdenen: 1600.00,
      odemeYontemi: 'Bezmialem Vakıf Kart',
      netOdenen: 1600.00
    },
    sonuc: 'Genel sağlık durumu iyi. Vitamin desteği önerildi.',
    notlar: 'Vitamin D takviyesi başlandı. 3 ay sonra kontrol.',
    raporUrl: '/rapor-3.pdf'
  },
  4: {
    id: 4,
    ad: 'Ortopedi Muayenesi',
    tarih: '18 Ekim 2025',
    saat: '09:00',
    hastane: 'Bezmialem Vakıf Üniversitesi Hastanesi',
    klinik: 'Ortopedi Kliniği',
    doktor: 'Prof. Dr. Selim Arslan',
    odemeBilgileri: {
      toplamTutar: 3200.00,
      indirimOrani: null,
      indirimTutari: 200.00,
      kartIleOdenen: 3000.00,
      odemeYontemi: 'Bezmialem Vakıf Kart',
      netOdenen: 3000.00
    },
    sonuc: 'Diz ekleminde hafif dejenerasyon tespit edildi. Fizik tedavi önerildi.',
    notlar: '10 seans fizik tedavi planlandı.',
    raporUrl: '/rapor-4.pdf'
  },
  5: {
    id: 5,
    ad: 'Dermatoloji Kontrolü',
    tarih: '10 Ekim 2025',
    saat: '11:45',
    hastane: 'Bezmialem Fatih Hastanesi',
    klinik: 'Dermatoloji Kliniği',
    doktor: 'Uzm. Dr. Zeynep Şahin',
    odemeBilgileri: {
      toplamTutar: 1500.00,
      indirimOrani: 15,
      indirimTutari: null,
      kartIleOdenen: 1275.00,
      odemeYontemi: 'Bezmialem Vakıf Kart',
      netOdenen: 1275.00
    },
    sonuc: 'Cilt muayenesi normal. Koruyucu bakım önerileri verildi.',
    notlar: 'Güneş koruyucu kullanımına dikkat edilmesi.',
    raporUrl: '/rapor-5.pdf'
  }
};

export const getTedaviDetay = (id: number): TedaviDetay | undefined => {
  return mockTedaviDetaylar[id];
};
