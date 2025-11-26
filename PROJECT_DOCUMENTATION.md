# Bezmialem Vakıf Kart Mobil Uygulaması - Proje Dokümantasyonu

## Proje Genel Bakış

Bu proje, Bezmialem Vakıf Üniversitesi için geliştirilmiş modern bir sağlık kartı mobil uygulamasıdır. Uygulama, hastane hizmetlerinden faydalanan kullanıcıların kart bakiyelerini görüntülemelerini, işlem geçmişlerini takip etmelerini ve indirim oranlarını yönetmelerini sağlar.

### Teknoloji Stack
- **Framework:** Ionic React 7.x + React 18.x
- **Build Tool:** Vite 5.4.21
- **Mobile Runtime:** Capacitor 5.7.8 (iOS + Android)
- **Styling:** CSS Modules + Ionic Components + CSS Variables
- **State Management:** React Hooks (useState, useEffect, useRef)
- **Routing:** React Router DOM + Ionic Router
- **PDF Generation:** jsPDF + html2canvas
- **Type System:** TypeScript 5.x

### Renk Şeması
- **Primary:** #93153c (Koyu kırmızı - marka rengi)
- **Dark Accent:** #18181a (Koyu gri)
- **Success:** #10B981 (Yeşil)
- **Background:** #ffffff (Beyaz)
- **Text:** #1F1F1F (Koyu gri)
- **Medium Gray:** #6B7280

---

## Proje Yapısı

```
mobil_uygulama/
├── src/
│   ├── pages/              # Tüm sayfa bileşenleri
│   │   ├── LoginPage.tsx/css           # Giriş sayfası (TC + Telefon)
│   │   ├── OtpPage.tsx/css             # OTP doğrulama
│   │   ├── BasvuruKontroluPage.tsx/css # Başvuru sorgulama
│   │   ├── DashboardPage.tsx/css       # Ana sayfa (kart + bakiye + tabs)
│   │   ├── IslemlerPage.tsx/css        # İşlemler listesi
│   │   ├── IslemDetayPage.tsx/css      # İşlem detayı + PDF indirme
│   │   ├── ProfilPage.tsx/css          # Profil + ayarlar
│   │   ├── DestekPage.tsx/css          # Destek sayfası
│   │   └── IletisimPage.tsx/css        # İletişim sayfası
│   ├── components/         # Paylaşılan bileşenler (şu anda boş)
│   ├── services/
│   │   ├── api.ts          # API servis fonksiyonları (TODO: backend)
│   │   ├── mockData.ts     # Mock kullanıcı ve işlem verileri
│   │   └── mock-data.ts    # Ek mock veriler
│   ├── types/
│   │   ├── user.ts         # User, Indirim interface'leri
│   │   ├── tedavi.ts       # Tedavi, TedaviDetay interface'leri
│   │   └── payment.ts      # Ödeme tipleri
│   ├── theme/
│   │   ├── variables.css   # CSS değişkenleri (renkler, spacing, typography)
│   │   └── global.css      # Global stil tanımları
│   ├── App.tsx             # Root component (routing + auth logic)
│   └── main.tsx            # Entry point
├── android/                # Android native projesi
│   ├── app/
│   │   └── build.gradle    # Signing config ile güncellenmiş
│   └── build.gradle
├── ios/                    # iOS native projesi
│   └── App/
│       ├── App.xcworkspace # Xcode workspace
│       └── Podfile         # CocoaPods dependencies
├── public/                 # Statik asset'ler
│   ├── assets/
│   └── svg/
├── capacitor.config.ts     # Capacitor konfigürasyonu
├── vite.config.ts          # Vite build konfigürasyonu
├── package.json            # NPM dependencies
└── tsconfig.json           # TypeScript konfigürasyonu
```

---

## Sayfa Detayları

### 1. LoginPage (`/login`)
**Amaç:** Kullanıcı girişi için TC Kimlik ve Telefon doğrulaması

**Özellikler:**
- Native HTML input'lar (IonInput yerine - rendering sorunları nedeniyle)
- TC Kimlik validasyonu: 11 haneli + algoritma kontrolü
- Telefon validasyonu: 10 haneli sayı kontrolü
- "Başvuru Kontrolü" linki → `/basvuru-kontrolu`
- Başarılı submit → `/otp` sayfasına yönlendirir

**Stil:**
- Input border: `2px solid #E5E7EB`
- Focus state: `border-color: #93153c` + shadow
- Beyaz arka plan, minimal tasarım

**Validation Algoritması:**
```typescript
// TC Kimlik: İlk hane 0 olamaz, 11 haneli
// 1-9. hanelerin toplamının mod10'u = 10. hane
// 1-10. hanelerin toplamının mod10'u = 11. hane
```

---

### 2. OtpPage (`/otp`)
**Amaç:** 6 haneli OTP kodu doğrulama

**Özellikler:**
- 6 adet native HTML number input
- Otomatik focus progression (rakam girilince sonraki input'a geçer)
- Backspace ile geri gitme
- "Doğrula ve Devam Et" butonu
- Başarılı doğrulama → Dashboard'a yönlendirir

**Stil:**
- Input height: `60px`
- Font size: `24px`
- Border: `2px solid #D1D5DB`
- Focus: `border-color: #93153c`

**Not:** Backend entegrasyonu TODO - şu anda her kod kabul ediliyor.

---

### 3. BasvuruKontroluPage (`/basvuru-kontrolu`)
**Amaç:** Kart başvuru durumu sorgulama

**Özellikler:**
- TC Kimlik + Telefon ile sorgulama
- Mock response sistemi (4 durum):
  - `onaylandi` (Yeşil badge)
  - `beklemede` (Sarı badge)
  - `reddedildi` (Kırmızı badge)
  - `bulunamadi` (Gri badge)
- Sonuç kartı: durum, mesaj, başvuru tarihi, işlem tarihi, açıklama

**Mock Data Yapısı:**
```typescript
{
  durum: 'onaylandi' | 'beklemede' | 'reddedildi' | 'bulunamadi',
  mesaj: string,
  basvuruTarihi: string,
  islemTarihi: string,
  aciklama: string
}
```

---

### 4. DashboardPage (`/dashboard`) ⭐ Ana Sayfa
**Amaç:** Kullanıcının kart bilgileri, bakiye ve işlemler özeti

#### Layout Yapısı:

**A. Üst Bölüm (Kart Görseli):**
- Tam genişlik virtual kart görseli (360px max-width, 200px yükseklik)
- Gradient arka plan: `#18181a → #2d2d2f`
- Kart içeriği:
  - Başlık: "BEZMİALEM VAKIF KART"
  - Ad Soyad: `{mockUser.ad} {mockUser.soyad}`
  - Kart No: `{mockUser.kartNo}` (tam numara, maskelenmemiş)
  - Chip: Altın gradient (`#FFD700 → #FFA500`)

**B. Bakiye Kartı:**
- Şeffaf beyaz arka plan (`rgba(255,255,255,0.15)`)
- Blur efekti (`backdrop-filter: blur(10px)`)
- İçerik:
  - "Mevcut Bakiye" başlığı
  - Bakiye tutarı: `₺2,450.00` (32px, bold)
  - Status dot: Yeşil, pulse animasyonlu
  - "Aktif" durumu

**C. İndirim Kartı:**
- Bakiye kartı ile aynı stil
- "Tanımlı İndirimler" başlığı
- Her indirim için badge:
  - Yeşil indirim oranı: `%20` (20px, bold)
  - İndirim türü: "Şehit/Gazi Yakını İndirimi" (13px)
  - İç içe şeffaf arka plan

**Mock İndirimler:**
```typescript
indirimler: [
  { tur: 'Şehit/Gazi Yakını İndirimi', oran: 20 },
  { tur: 'Emekli İndirimi', oran: 10 }
]
```

**D. İçerik Tabları (IonSegment):**
- 2 tab: "Duyurular" ve "İşlemler"
- Aktif tab: Kırmızı arka plan (#93153c), beyaz yazı, 8px border-radius
- Pasif tab: Gri yazı (#6B7280)

**Tab İçerikleri:**

1. **Duyurular Tab:**
   - Tarih + başlık + içerik
   - Takvim ikonu
   - Mock data: 3 duyuru

2. **İşlemler Tab:**
   - Son işlemler listesi
   - Her işlem kartında:
     - Tarih + işlem türü
     - Hastane + doktor
     - Tutar + durum badge
   - Karta tıklayınca → `/islemler/{id}` detay sayfası

---

### 5. IslemlerPage (`/islemler`)
**Amaç:** Tüm işlemlerin infinite scroll liste görünümü

**Özellikler:**
- Infinite scroll: IonInfiniteScroll ile 5'er batch yükleme
- Mock data: 8 toplam işlem
- İşlem kartı içeriği:
  - Tarih, işlem türü
  - Doktor, hastane
  - Tutar, durum (tamamlandi/beklemede)
- Kart tıklaması → `/islemler/:id` ile detaya git

**Stil:**
- Card-based layout
- Status badge: Yeşil (tamamlandı), Sarı (beklemede)
- Responsive grid

---

### 6. IslemDetayPage (`/islemler/:id`)
**Amaç:** Tek işlemin detaylı görünümü + PDF rapor indirme

**Özellikler:**
- Header: İkon (kırmızı daire içinde), başlık, durum badge
- İşlem Bilgileri Kartı:
  - Tarih
  - Doktor
  - Hastane
  - İşlem Türü
  - Tutar (kırmızı vurgu)
- Açıklama Kartı: Detaylı açıklama metni
- **"Rapor İndir" Butonu** (sadece tamamlanan işlemler için)

**PDF İndirme Sistemi:**
- **Kütüphaneler:** `jspdf` + `html2canvas`
- **Süreç:**
  1. Sayfa içeriği `contentRef` ile yakalanır
  2. `html2canvas` ile canvas'a çevrilir (2x scale, beyaz arka plan)
  3. `jsPDF` ile A4 PDF oluşturulur
  4. Çok sayfalı destek (her 297mm'de yeni sayfa)
  5. Dosya adı: `Islem_Raporu_{id}_{tarih}.pdf`
- **UI Feedback:** İndirme sırasında spinner + "İndiriliyor..." yazısı

**Kod Snippet:**
```typescript
const handleDownloadReport = async () => {
  const canvas = await html2canvas(contentRef.current, {
    allowTaint: true,
    useCORS: true,
    backgroundColor: '#ffffff',
    scale: 2,
    logging: false
  });

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const imgData = canvas.toDataURL('image/png');
  pdf.addImage(imgData, 'PNG', 0, 0, 210, imgHeight);
  pdf.save(`Islem_Raporu_${id}_${date}.pdf`);
};
```

---

### 7. ProfilPage (`/profil`)
**Amaç:** Kullanıcı profili, istatistikler ve ayarlar

**Özellikler:**

**A. Profil Header:**
- Avatar (kırmızı gradient, baş harfler)
- Ad Soyad
- İstatistikler:
  - Toplam tedavi sayısı: 12
  - Bu ay tedavi: 3

**B. Kişisel Bilgiler:**
- T.C. Kimlik Numarası
- Telefon Numarası
- E-posta Adresi
- **Not:** Kart numarası GÖSTERİLMEZ (güvenlik)

**C. Hesap Ayarları (3 modal):**

1. **Şifre Değiştir Modalı:**
   - Eski Şifre
   - Yeni Şifre
   - Yeni Şifre Tekrar
   - Validasyon: Yeni şifreler eşleşmeli, min 6 karakter
   - Başarılı → Toast notification

2. **Telefon Değiştir Modalı:**
   - Yeni Telefon Numarası
   - OTP Kodu (mock: 6 haneli input)
   - Validasyon: 10 haneli telefon
   - Mock OTP sistemi

3. **E-posta Değiştir Modalı:**
   - Yeni E-posta
   - Validasyon: Email regex
   - Başarılı → Toast notification

**D. Çıkış Yap:**
- Butona basınca `handleLogout()` çağrılır
- localStorage'dan `bezmialem_auth` silinir
- Login sayfasına yönlendirilir

---

### 8. DestekPage & IletisimPage
**Amaç:** Destek ve iletişim bilgileri (placeholder sayfalar)

**Not:** Bu sayfalar henüz tasarlanmamış, sadece navigation için var.

---

## Authentication & Routing Sistemi

### Auth State Yönetimi
- **Storage:** `localStorage` kullanılıyor (key: `bezmialem_auth`)
- **Initial State:** localStorage'dan okunuyor
- **Persistence:** Sayfa yenilenince bile oturum korunuyor

```typescript
const [isLoggedIn, setIsLoggedIn] = useState(() => {
  const savedAuth = localStorage.getItem('bezmialem_auth');
  return savedAuth === 'true';
});

useEffect(() => {
  localStorage.setItem('bezmialem_auth', isLoggedIn.toString());
}, [isLoggedIn]);
```

### Route Yapısı

**Unauthenticated Routes (Login olmadan):**
- `/login` → LoginPage
- `/otp` → OtpPage
- `/basvuru-kontrolu` → BasvuruKontroluPage
- `/` → Redirect to `/login`

**Authenticated Routes (Login sonrası):**
- IonTabs ile tab bar'lı yapı
- Routes:
  - `/dashboard` → DashboardPage (Ana Sayfa tab)
  - `/islemler` → IslemlerPage (İşlemler tab)
  - `/islemler/:id` → IslemDetayPage
  - `/destek` → DestekPage (Destek tab)
  - `/iletisim` → IletisimPage (İletişim tab)
  - `/profil` → ProfilPage (Profil tab)
  - `/` → Redirect to `/dashboard`

**Önemli:** `animated={false}` her iki IonRouterOutlet'te de aktif (Ionic dynamic import 404 hatalarını önlemek için).

### Tab Bar Stili
- **Background:** Beyaz
- **Height:** 64px
- **Border:** 1px top border (#E5E7EB)
- **Passive tab:** Gri yazı (#6B7280), 22px icon
- **Active tab:** Beyaz yazı, kırmızı arka plan (#93153c), 600 weight, 12px border-radius (üst köşeler)
- **Tab isimleri:** Ana Sayfa, İşlemler, Destek, İletişim, Profil

---

## Data Types & Interfaces

### User Interface
```typescript
export interface Indirim {
  tur: string;
  oran: number;
}

export interface User {
  ad: string;
  soyad: string;
  tcKimlik: string;
  kartNo: string;
  durum: 'Aktif' | 'Pasif';
  telefon?: string;
  eposta?: string;
  indirimler?: Indirim[];
}
```

### Tedavi/İşlem Interfaces
```typescript
export interface Tedavi {
  id: number;
  tarih: string;
  hastane: string;
  tur: string;
  doktor: string;
}

export interface TedaviDetay extends Tedavi {
  ad: string;
  saat: string;
  klinik: string;
  odemeBilgileri: {
    toplamTutar: number;
    indirimOrani: number;
    indirimTutari: number;
    kartIleOdenen: number;
    odemeYontemi: string;
  };
  sonuc: string;
  notlar?: string;
  raporUrl?: string;
}
```

### Mock Data Örneği
```typescript
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
```

---

## Build & Deploy

### Development Server
```bash
npm run dev
# Vite dev server: http://localhost:5173 (veya boş portlar)
```

### Production Build
```bash
npm run build
# Output: dist/ klasörü
```

### Android Build

**Gereksinimler:**
- Java JDK 17 (Azul Zulu)
- Gradle (Android Studio ile gelir)

**Adımlar:**
```bash
# 1. Production build
npm run build

# 2. Capacitor sync
npx cap sync android

# 3. Release APK (imzalı)
cd android
./gradlew assembleRelease
# Output: android/app/build/outputs/apk/release/app-release.apk

# 4. Debug APK (test için)
./gradlew assembleDebug
# Output: android/app/build/outputs/apk/debug/app-debug.apk
```

**Signing Config:**
- Keystore: `bezmialem-release-key.keystore` (proje root'unda)
- Store/Key Password: `bezmialem2024`
- Alias: `bezmialem`
- `android/app/build.gradle` içinde signing config tanımlı

**APK Dosyaları:**
- `bezmialem-kart-app-debug.apk` (4.7 MB) - Test için
- `bezmialem-kart-app-signed.apk` (3.9 MB) - Production

### iOS Build

**Gereksinimler:**
- macOS
- Xcode 15+
- CocoaPods

**Adımlar:**
```bash
# 1. Production build
npm run build

# 2. CocoaPods kurulumu (ilk defa)
sudo gem install cocoapods

# 3. Pods kurulumu
cd ios/App
pod install

# 4. Capacitor sync
cd ../..
npx cap sync ios

# 5. Xcode'da aç
npx cap open ios

# Xcode'da:
# - Simulator seçin
# - Signing & Capabilities > Team seçin
# - Cmd+R ile çalıştırın
```

**Bundle Identifier:** `com.bezmialem.vakifkart`

**Not:** Personal Team ile simulator'da test edilebilir. Fiziksel cihaz için Apple Developer hesabı gerekli.

---

## Önemli Teknik Kararlar ve Sorun Çözümleri

### 1. IonInput → Native HTML Input Geçişi
**Sorun:** IonInput component'leri bazen render olmuyordu (özellikle OTP ve Login sayfalarında).

**Çözüm:** Native HTML `<input>` elemanları kullanıldı.
- Manual label'lar
- CSS ile border ve focus state kontrolü
- `inputMode="numeric"` mobile keyboard için

### 2. Ionic Dynamic Import 404 Hatası
**Sorun:** Sayfa geçişlerinde Vite chunk dosyaları 404 hatası veriyordu.

**Çözüm:**
- `animated={false}` IonRouterOutlet'te
- `vite.config.ts` içinde `@ionic/core/components` optimizeDeps'ten exclude edildi

### 3. Hard Refresh Cache Sorunu
**Sorun:** Cmd+Shift+R ile sayfa yenilenince asset'ler kayboluyordu.

**Çözüm:**
- `index.html` içine cache header meta tag'leri eklendi
- `vite.config.ts` içinde `publicDir: 'public'` ve `assetsDir: 'assets'` tanımlandı

### 4. LocalStorage ile Auth Persistence
**Sorun:** Sayfa yenilenince kullanıcı logout oluyordu.

**Çözüm:**
- `useState` initial value'da localStorage'dan oku
- `useEffect` ile her state değişiminde localStorage'a yaz

### 5. PDF İndirme Entegrasyonu
**Sorun:** İşlem raporlarını kullanıcıya vermek gerekiyordu.

**Çözüm:**
- `html2canvas` ile sayfa screenshot'u
- `jsPDF` ile PDF oluşturma
- Multi-page desteği (A4 formatı için sayfa bölme)

---

## CSS Tema Sistemi

### CSS Variables (variables.css)

```css
/* Ionic Color Tokens */
--ion-color-primary: #93153c;
--ion-color-primary-rgb: 147,21,60;
--ion-color-primary-contrast: #ffffff;

--ion-color-medium: #6B7280;
--ion-background-color: #ffffff;
--ion-text-color: #1F1F1F;

/* Custom Variables */
--primary: #93153c;
--primary-hover: #7a1132;
--dark-accent: #18181a;
--success: #10B981;
--warning: #F59E0B;
--error: #EF4444;

/* Typography */
--font-size-xs: 12px;
--font-size-sm: 13px;
--font-size-base: 14px;
--font-size-lg: 16px;
--font-size-xl: 18px;
--font-size-2xl: 20px;
--font-size-3xl: 24px;
--font-size-4xl: 30px;

--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;

/* Spacing */
--spacing-1: 4px;
--spacing-2: 8px;
--spacing-3: 12px;
--spacing-4: 16px;
--spacing-5: 20px;
--spacing-6: 24px;
--spacing-8: 32px;

/* Border Radius */
--radius-sm: 8px;
--radius-md: 12px;
--radius-lg: 16px;
--radius-full: 9999px;
```

### Global Styles (global.css)

**Tab Bar Özelleştirme:**
```css
ion-tab-bar {
  --background: #ffffff;
  border-top: 1px solid #E5E7EB;
  height: 64px;
}

ion-tab-button {
  --color: #6B7280; /* Pasif */
  --color-selected: #ffffff; /* Aktif */
}

ion-tab-button.tab-selected {
  background: #93153c;
  border-radius: 12px 12px 0 0;
  font-weight: 600;
}

ion-tab-button ion-icon {
  font-size: 22px;
}
```

---

## Backend Entegrasyon TODO Listesi

Şu anda uygulama tamamen mock data ile çalışıyor. Backend entegrasyonu için yapılması gerekenler:

### API Endpoints (api.ts içinde tanımlanacak)

1. **Auth Endpoints:**
   - `POST /api/auth/login-verify` - TC + Telefon doğrulama, OTP gönderme
   - `POST /api/auth/otp-verify` - OTP doğrulama, token dönme
   - `POST /api/auth/logout` - Logout işlemi

2. **User Endpoints:**
   - `GET /api/user/profile` - Kullanıcı bilgileri
   - `GET /api/user/balance` - Kart bakiyesi
   - `GET /api/user/discounts` - İndirim listesi
   - `PUT /api/user/password` - Şifre değiştirme
   - `PUT /api/user/phone` - Telefon değiştirme
   - `PUT /api/user/email` - Email değiştirme

3. **Application Endpoints:**
   - `POST /api/application/check` - Başvuru kontrolü

4. **Transaction Endpoints:**
   - `GET /api/transactions` - İşlem listesi (pagination)
   - `GET /api/transactions/:id` - İşlem detayı
   - `GET /api/transactions/:id/report` - PDF rapor indirme

5. **Content Endpoints:**
   - `GET /api/announcements` - Duyurular listesi

### Token Management
```typescript
// services/api.ts içinde
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://api.bezmialem.edu.tr';

// Her request'e token eklenecek
const getAuthHeaders = () => ({
  'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
  'Content-Type': 'application/json'
});
```

### Mock Data Değişimi
- `mockData.ts` dosyasındaki tüm veriler API'den gelecek
- Login sonrası token localStorage'a kaydedilecek
- Her sayfa yüklenişinde API'den fresh data çekilecek

---

## Geliştirme Notları

### Stil Özelleştirmeleri
- **Gradient Backgrounds:** Dashboard kart bölümünde `linear-gradient(135deg, #93153c 0%, #7a1132 100%)`
- **Blur Effects:** Bakiye ve indirim kartlarında `backdrop-filter: blur(10px)`
- **Pulse Animation:** Aktif durum dot'unda 2s sonsuz pulse
- **Segment Buttons:** Aktif tab kırmızı arka plan + beyaz yazı, 8px border-radius

### Responsive Tasarım
- Mobil-first approach
- Test edilen viewport: 430×932 (iPhone 14 Pro Max)
- Max-width sınırları büyük ekranlar için tanımlı

### Performans Optimizasyonları
- Lazy loading (React Router ile)
- Chunk splitting (Vite otomatik yapıyor)
- Asset optimization (Vite minification)
- CSS variables (runtime değişiklikler için)

### Accessibility
- Semantic HTML kullanımı
- ARIA labels (Ionic component'lerde built-in)
- Keyboard navigation desteği
- Yüksek kontrast oranları

---

## Bilinen Sorunlar ve Sınırlamalar

1. **Chrome Extension Hatası:**
   ```
   Unchecked runtime.lastError: The page keeping the extension port is moved into back/forward cache
   ```
   - Bu hata tarayıcı extension'larından (örn. React DevTools) kaynaklanıyor
   - Uygulama fonksiyonelliğini etkilemiyor
   - Production build'de görünmüyor

2. **Vite CJS Deprecation Warning:**
   ```
   The CJS build of Vite's Node API is deprecated
   ```
   - Uyarı seviyesinde, build başarılı oluyor
   - Gelecek Vite versiyonunda düzeltilecek

3. **Chunk Size Warning:**
   ```
   Some chunks are larger than 500 kB after minification
   ```
   - Ionic ve React kütüphaneleri büyük
   - Production'da önemli bir sorun değil
   - Gerekirse code splitting ile optimize edilebilir

4. **iOS Simulator Logging:**
   ```
   Logging Error: Failed to initialize logging system
   ```
   - Xcode/Simulator logging quirk'ü
   - Çözüm: Scheme'de `IDEPreferLogStreaming=YES` environment variable ekle
   - Uygulama çalışmasını etkilemiyor

---

## Deployment Checklist

### Pre-Production

- [ ] Tüm mock data'yı API call'larla değiştir
- [ ] Error handling ve loading state'leri ekle
- [ ] API base URL'i environment variable'a taşı
- [ ] Token refresh mechanism ekle
- [ ] Analytics entegrasyonu (optional)
- [ ] Crash reporting (optional - Sentry, Firebase)
- [ ] Push notification setup (optional)

### Android

- [ ] Keystore dosyasını güvenli yere yedekle
- [ ] Google Play Console'da uygulama oluştur
- [ ] Store listing hazırla (screenshots, açıklama)
- [ ] Release APK'yı imzala ve yükle
- [ ] Internal testing → Alpha → Beta → Production

### iOS

- [ ] Apple Developer hesabı (99$/yıl)
- [ ] App Store Connect'te uygulama oluştur
- [ ] Provisioning profile ve certificates oluştur
- [ ] TestFlight beta testing
- [ ] App Store review için submit

### Backend Requirements

- [ ] HTTPS endpoint'leri hazır
- [ ] CORS ayarları yapılmış
- [ ] JWT token sistemi aktif
- [ ] Rate limiting implementasyonu
- [ ] API documentation (Swagger/OpenAPI)

---

## Destek ve İletişim

**Proje Sahibi:** Bezmialem Vakıf Üniversitesi  
**Bundle ID:** `com.bezmialem.vakifkart`  
**App Name:** Bezmialem Vakıf Kart

**Geliştirme Ortamı:**
- Node.js: 18.x veya üzeri
- npm: 9.x veya üzeri
- Java JDK: 17 (Android için)
- Ruby: 3.4+ (iOS CocoaPods için)

---

## Hızlı Başlangıç (Yeni Geliştirici İçin)

```bash
# 1. Repository'yi klonla
git clone <repo-url>
cd mobil_uygulama

# 2. Dependencies kur
npm install

# 3. Dev server başlat
npm run dev

# 4. Tarayıcıda aç
# http://localhost:5173

# 5. Giriş yap (herhangi bir TC + Telefon + OTP kabul edilir)
# TC: 11 haneli geçerli bir sayı
# Telefon: 10 haneli sayı
# OTP: 6 haneli herhangi bir sayı

# 6. Android build (opsiyonel)
npm run build
npx cap sync android
cd android && ./gradlew assembleDebug

# 7. iOS build (opsiyonel, macOS gerekli)
npm run build
npx cap sync ios
npx cap open ios
```

---

## Version History

### v1.0.0 (Current)
- ✅ Authentication flow (Login + OTP)
- ✅ Dashboard with card visualization
- ✅ Transaction list and details
- ✅ PDF report download
- ✅ Profile management
- ✅ Discount display
- ✅ Application status check
- ✅ Android APK build
- ✅ iOS build support
- ⏳ Backend integration (TODO)

---

## Gelecek Özellikler (Roadmap)

### Phase 2 (Backend Integration)
- [ ] Real API integration
- [ ] JWT authentication
- [ ] Push notifications
- [ ] QR code scanning for payments
- [ ] Appointment booking system

### Phase 3 (Advanced Features)
- [ ] Biometric authentication (Face ID, Touch ID)
- [ ] Dark mode support
- [ ] Multi-language (TR/EN)
- [ ] Offline mode (cached data)
- [ ] Export transaction history (Excel, CSV)

### Phase 4 (Analytics)
- [ ] User behavior analytics
- [ ] Performance monitoring
- [ ] A/B testing infrastructure

---

## Sonuç

Bu dokümantasyon, Bezmialem Vakıf Kart mobil uygulamasının tüm teknik detaylarını, mimari kararlarını ve geliştirme sürecini kapsamaktadır. Yeni bir geliştirici veya AI asistanı bu dökümanı okuyarak projeyi tam olarak anlayabilir ve geliştirme yapabilir.

**Önemli:** Mock data ile çalışan bu versiyon, backend entegrasyonu tamamlanmadan production'a çıkarılmamalıdır. Tüm API endpoint'leri `services/api.ts` dosyasında TODO olarak işaretlenmiştir.
