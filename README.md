# odemeApp

Basit bir Ionic + Vue 3 mobil uygulama scaffold'u (dummy verilerle). Amaç: Login, Dashboard, Transactions, Transaction Detail ve Profile sayfalarını içeren örnek uygulama.

## Gereksinimler

- Node.js (14+ önerilir)
- npm
- Ionic CLI (global)
- Xcode / Android Studio (native platformlar için)

## Hızlı başlangıç

1. Node ve npm kontrol

```bash
node -v
npm -v
```

Eksikse (macOS):

- Node via Homebrew:

```bash
brew install node
```

2. Ionic CLI yükle (global)

```bash
npm i -g @ionic/cli
```

3. Bağımlılıkları yükle

```bash
npm install
```

4. Geliştirme sunucusunu çalıştır

```bash
npm run dev
```

Tarayıcıda `http://localhost:5173` (Vite varsayılan) açın.

## API Ortam Yapılandırması

Uygulama tüm backend istekleri için merkezi bir base URL kullanır. Bu değer Vite ortam değişkenlerinden (`VITE_API_BASE_URL`) okunur ve `src/services/api.ts` içindeki Axios wrapper tarafından kullanılır.

1) Önce `.env.example` dosyasını inceleyin ve uygun ortam dosyasına kopyalayın:

```
cp .env.example .env.development
cp .env.example .env.staging
cp .env.example .env.production
```

2) Her ortam için API base URL değerini güncelleyin:

```
# .env.development
VITE_API_BASE_URL=http://localhost:3000

# .env.staging
VITE_API_BASE_URL=https://staging-api.example.com

# .env.production
VITE_API_BASE_URL=https://api.example.com
```

Notlar:
- Vite ile istemciye açılacak değişkenler `VITE_` ile başlamalıdır.
- `apiEndpoints.ts` dosyasından uç noktaları, `api.ts` dosyasından ise baseURL, token ve hata yönetimini merkezi olarak kontrol edebilirsiniz.

## Login bilgileri (dummy)

- TC: `12345678901`
- Parola: `1234`

## Capacitor (iOS / Android) - hızlı rehber

> Not: Aşağıdaki adımlar sisteminizde Xcode / Android Studio ve Java SDK yüklü olduğunu varsayar.

1. Capacitor paketlerini yükleyin (eğer package.json'a ekliyse zaten yüklü olabilir)

```bash
npm install @capacitor/core @capacitor/cli --save-dev
```

2. Capacitor initialization (proje kökünde)

```bash
npx cap init odemeApp com.example.odemeApp --web-dir=dist
```

3. Build ve sync

```bash
npm run build
npx cap sync
```

4. Platform ekle

```bash
npx cap add ios
npx cap add android
```

5. Xcode veya Android Studio ile açın

```bash
npx cap open ios
npx cap open android
```

6. Geliştirme sırasında canlı reload denemek için (ayrıntılı ayarlar gerekebilir):

```bash
ionic capacitor run ios -l --external
ionic capacitor run android -l --external
```

## Dosya yapısı (özet)

```
odemeApp/
 ├── src/
 │   ├── views/
 │   │   ├── LoginPage.vue
 │   │   ├── DashboardPage.vue
 │   │   ├── TransactionsPage.vue
 │   │   ├── TransactionDetailPage.vue
 │   │   └── ProfilePage.vue
 │   ├── router/
 │   │   └── index.ts
 │   └── data/
 │       └── user.ts
```

## Notlar ve sonraki adımlar

- Bu proje dummy JSON verisi kullanır (`src/data/user.ts`). Gerçek API'ye bağlanmak için servis katmanı ekleyin.
- Geliştirme sırasında TypeScript tiplerini ve ESLint'i eklemek iyi olacaktır.
- Auth daha sağlam olmalı (token, refresh, güvenli saklama vb.).

## Docker ile Android derleme (opsiyonel)

Eğer yerel olarak Android Studio kurmak istemiyorsanız veya CI tarzı bir ortamda build almak isterseniz, proje kökünde bir Docker imajı hazırladım. Not: iOS/Xcode işleri macOS ortamı gerektirdiğinden Docker ile iOS derleyemezsiniz.

1) Docker imajını oluşturun:

```bash
docker compose build
```

2) Android APK üretmek için container çalıştırıp scripti çalıştırın:

```bash
# Etkileşimli shell (isteğe bağlı)
docker compose run --rm android-builder /bin/bash

# Veya doğrudan build scriptini çalıştırın
docker compose run --rm android-builder bash /workspace/scripts/build-android.sh
```

3) Üretilen APK'ları şu klasörde bulabilirsiniz (host içinde):

```
android/app/build/outputs/apk/
```

Notlar:
- İlk defa çalıştırırken Android SDK bileşenleri indirileceğinden uzun sürebilir.
- Eğer Gradle veya Android platform hatası alırsanız, Android Studio veya Android SDK bileşenlerinin sürümlerini kontrol edin.
- iOS derlemesi için macOS + Xcode gereklidir; bu adım Docker ile yapılamaz. CI ortamı olarak Mac Runner (ör. GitHub Actions macos-latest) veya MacStadium benzeri macOS hizmetleri kullanılabilir.

Hazır olduğunuzda Capacitor platformlarını eklemeye ve gerçek backend'e bağlamaya yardımcı olabilirim.
