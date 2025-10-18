# HollyPolly - Gerçek Zamanlı Oda Seçim Uygulaması

Arkadaşlarınla gerçek zamanlı olarak karar ver! Oda oluştur, katılımcıları davet et, kazanan veya kaybedeni seç.

## 🚀 Özellikler

- ✨ Gerçek zamanlı oda yönetimi
- 👥 Dinamik kullanıcı listesi
- ✏️ İsim düzenleme (kullanıcılar kendi isimlerini değiştirebilir)
- 👑 Admin sistemi (ilk gelen admin, admin başkasını admin yapabilir)
- 🗑️ Otomatik oda temizleme (son kullanıcı çıkınca oda silinir)
- 🎯 Kazanan/Kaybeden seçimi
- 🔄 Tekrar başlat özelliği
- 🌍 Çoklu dil desteği (TR/EN)
- 📱 Responsive tasarım
- 🎨 Framer Motion animasyonları
- 🔗 Kolay oda paylaşımı

## 🛠️ Teknolojiler

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Database:** Supabase (PostgreSQL + Realtime)
- **State Management:** Context API
- **Animations:** Framer Motion
- **i18n:** next-intl
- **Deployment:** Netlify

## 📦 Kurulum

### 1. Bağımlılıkları yükleyin

```bash
npm install
```

### 2. Supabase Kurulumu

1. [Supabase](https://supabase.com) hesabı oluşturun
2. Yeni bir proje oluşturun
3. SQL Editor'de `supabase/schema.sql` dosyasını çalıştırın
   - Bu adım tabloları, RLS politikalarını VE Realtime'ı otomatik kurar ✅
4. Project Settings > API'den URL ve anon key'i kopyalayın

### 3. Environment Variables

`.env.local` dosyasını oluşturun:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 4. Development Server

```bash
npm run dev
```

Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açın.

## 🎮 Kullanım

1. Ana sayfaya girin, otomatik olarak yeni bir oda oluşturulur
2. Oda linkini kopyalayıp arkadaşlarınızla paylaşın
3. İlk katılan kişi otomatik admin olur
4. Admin, seçenekler ekleyebilir ve sonuç seçebilir
5. Tüm değişiklikler gerçek zamanlı olarak herkese yansır

## 📁 Proje Yapısı

```
hollypolly/
├── app/
│   ├── room/[roomId]/page.tsx    # Oda sayfası
│   ├── layout.tsx                 # Root layout
│   └── page.tsx                   # Ana sayfa (loading)
├── components/
│   ├── UserList.tsx              # Kullanıcı listesi
│   ├── OptionList.tsx            # Seçenek listesi
│   ├── ResultModal.tsx           # Sonuç modalı
│   └── ShareButton.tsx           # Paylaşım butonu
├── contexts/
│   ├── UserContext.tsx           # Kullanıcı state
│   └── RoomContext.tsx           # Oda state + Realtime
├── lib/
│   └── supabase/
│       ├── client.ts             # Supabase client
│       └── database.types.ts     # TypeScript types
├── messages/
│   ├── tr.json                   # Türkçe çeviriler
│   └── en.json                   # İngilizce çeviriler
└── supabase/
    └── schema.sql                # Veritabanı şeması
```

## 🔄 Realtime Event Flow

- **users.onInsert:** Yeni kullanıcı katıldığında liste güncellenir
- **users.onUpdate:** Admin değişikliği anında yansır
- **options.onInsert:** Yeni seçenek herkese gönderilir
- **rooms.onUpdate:** Sonuç seçildiğinde modal açılır

## 🌍 Çoklu Dil Desteği

Dil değiştirmek için URL'de dil kodunu kullanın:
- Türkçe: `http://localhost:3000/tr`
- İngilizce: `http://localhost:3000/en`

## 🚀 Deployment (Netlify)

### Otomatik Deployment

1. GitHub'a push edin
2. Netlify'da "New site from Git" seçin
3. Repository'yi seçin
4. Environment variables ekleyin:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Deploy!

### Manuel Deployment

```bash
npm run build
netlify deploy --prod
```

## 📝 Lisans

MIT

## 👨‍💻 Geliştirici
Ömer Hod - omerhodo@gmail.com
