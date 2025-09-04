# Mobile Code Editor

Mobil öncelikli, PWA uyumlu web kod editörü. Kullanıcılar mobil cihazlardan kod yazabilir, test edebilir ve dosyalarını yönetebilir.

## 🚀 Özellikler

### 📱 Mobil-First Tasarım
- Dokunmatik uyumlu arayüz
- Alt bar (bottom bar) ile kolay navigasyon
- Responsive tasarım
- PWA desteği

### ✍️ Kod Editörü
- **Desteklenen Diller**: HTML, CSS, JavaScript/TypeScript, JSON, Markdown, Python
- **CodeMirror 6** ile güçlü editör deneyimi
- Söz dizimi vurgulama ve kod renklendirme
- Otomatik tamamlama ve parantez eşleştirme
- Kod katlama (folding)
- Linter ve inline hata gösterimi
- Undo/redo desteği
- Bul & değiştir
- Çoklu seçim

### 📁 Dosya Yönetimi
- Dosya ve klasör oluşturma/silme
- Dosya yeniden adlandırma
- Dosya ağacı görünümü
- IndexedDB ile offline depolama

### 🖥️ Canlı Önizleme
- Split-view ile canlı önizleme
- Mobil, tablet ve masaüstü görünümleri
- Gerçek zamanlı kod çalıştırma
- Yeni sekmede açma

### 💻 Terminal
- Entegre terminal
- JavaScript kod çalıştırma
- Komut geçmişi
- Hata yönetimi

### 🔧 Git Entegrasyonu
- Commit, push, pull işlemleri
- Git durumu görüntüleme
- Commit geçmişi

### ♿ Erişilebilirlik
- WCAG AA uyumlu
- Yüksek kontrast modu
- Font boyutu ayarları
- Ekran okuyucu desteği
- Klavye navigasyonu
- Skip linkler

## 🛠️ Teknoloji Stack

- **Frontend**: Next.js 15 (App Router)
- **UI**: TailwindCSS
- **Editör**: CodeMirror 6
- **Depolama**: IndexedDB
- **PWA**: next-pwa
- **Test**: Jest + Testing Library
- **Deploy**: Vercel

## 📦 Kurulum

1. Bağımlılıkları yükleyin:
```bash
npm install
```

2. Geliştirme sunucusunu başlatın:
```bash
npm run dev
```

3. Tarayıcıda `http://localhost:3000` adresini açın

## 🧪 Test

```bash
# Tüm testleri çalıştır
npm test

# Watch modunda test
npm run test:watch

# Coverage raporu
npm run test:coverage
```

## 🚀 Deploy

### Vercel (Önerilen)

1. Projeyi GitHub'a push edin
2. Vercel'e bağlayın
3. Otomatik deploy

```bash
# Vercel CLI ile
npx vercel
```

### Manuel Build

```bash
npm run build
npm start
```

## 📱 PWA Kurulumu

1. Tarayıcıda uygulamayı açın
2. "Ana ekrana ekle" seçeneğini kullanın
3. Uygulama artık native app gibi çalışır

## 🎨 Kullanım

### Dosya Yönetimi
- Sol alt köşedeki "Dosyalar" butonuna tıklayın
- Yeni dosya/klasör oluşturmak için "+" butonunu kullanın
- Dosyaları yeniden adlandırmak için düzenle butonuna tıklayın

### Kod Yazma
- Dosya seçin ve editörde kod yazmaya başlayın
- Otomatik tamamlama ve söz dizimi vurgulama otomatik çalışır
- Hatalar editörde kırmızı çizgilerle gösterilir

### Canlı Önizleme
- "Çalıştır" butonuna tıklayın
- Cihaz türünü seçin (mobil/tablet/masaüstü)
- Kodunuzu gerçek zamanlı olarak görün

### Terminal
- "Terminal" butonuna tıklayın
- Komutları yazın ve Enter'a basın
- JavaScript kodunu `run <kod>` ile çalıştırın

## 🔧 API Endpoints

- `GET /api/projects` - Projeleri listele
- `POST /api/projects` - Yeni proje oluştur
- `GET /api/projects/[id]` - Proje detayı
- `PUT /api/projects/[id]` - Proje güncelle
- `DELETE /api/projects/[id]` - Proje sil
- `POST /api/run` - Kod çalıştır
- `POST /api/git` - Git işlemleri

## ♿ Erişilebilirlik Özellikleri

- **Yüksek Kontrast**: Daha iyi görünürlük için
- **Font Boyutu**: Küçük, orta, büyük seçenekleri
- **Azaltılmış Hareket**: Animasyonları devre dışı bırakma
- **Ekran Okuyucu**: Tam destek
- **Klavye Navigasyonu**: Tüm özellikler klavye ile erişilebilir

## 🐛 Bilinen Sorunlar

- CodeMirror 6'da bazı dil desteği eksik
- Terminal'de sadece JavaScript kodu çalıştırılabilir
- Git entegrasyonu mock (gerçek Git değil)

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

MIT License - detaylar için `LICENSE` dosyasına bakın.

## 🙏 Teşekkürler

- [CodeMirror](https://codemirror.net/) - Güçlü kod editörü
- [Next.js](https://nextjs.org/) - React framework
- [TailwindCSS](https://tailwindcss.com/) - CSS framework
- [Lucide React](https://lucide.dev/) - İkonlar