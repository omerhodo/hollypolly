# 🎲 HollyPolly
### Gerçek Zamanlı Kura Çekme Uygulaması · Real-Time Room Decision App

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=nextdotjs)](https://nextjs.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Realtime-3ECF8E?logo=supabase)](https://supabase.com/)
[![Netlify](https://img.shields.io/badge/Deployed%20on-Netlify-00C7B7?logo=netlify)](https://www.netlify.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

---

## 🇹🇷 Hakkında

Arkadaşlarınla **gerçek zamanlı olarak karar ver!**
Oda oluştur, katılımcıları davet et, kazananı veya kaybedeni seç.

### 🚀 Özellikler
- ✨ Gerçek zamanlı oda yönetimi
- 👥 Dinamik kullanıcı listesi
- ✏️ İsim düzenleme (kullanıcılar kendi isimlerini değiştirebilir)
- 👑 Admin sistemi (ilk gelen admin olur, admin yetkisini devredebilir)
- 🗑️ Otomatik oda temizleme (son kullanıcı çıkınca oda silinir)
- 🎯 Kazanan / Kaybeden seçimi
- 🔄 Tekrar başlat özelliği
- 🌍 Çoklu dil desteği (TR/EN)
- 📱 Responsive tasarım
- 🎨 Framer Motion animasyonları
- 🔗 Kolay oda paylaşımı

---

## 🛠️ Teknolojiler
| Teknoloji | Açıklama |
|------------|-----------|
| **Framework** | Next.js 14 (App Router) |
| **Stil** | Tailwind CSS |
| **Veritabanı** | Supabase (PostgreSQL + Realtime) |
| **Durum Yönetimi** | Context API |
| **Animasyonlar** | Framer Motion |
| **Çoklu Dil** | next-intl |
| **Dağıtım** | Netlify |

---

## 📦 Kurulum

### 1. Bağımlılıkları yükleyin
```bash
npm install
```

### 2. Supabase Kurulumu
1. [Supabase](https://supabase.com) hesabı oluşturun
2. Yeni bir proje oluşturun
3. SQL Editor'da `supabase/schema.sql` dosyasını çalıştırın
4. **Project Settings → API** sekmesinden URL ve anon key değerlerini kopyalayın

### 3. Ortam Değişkenleri
`.env.local` dosyası oluşturun:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 4. Geliştirme Sunucusunu Başlatın
```bash
npm run dev
```
Uygulama: [http://localhost:3000](http://localhost:3000)

---

## 🎮 Kullanım
1. Ana sayfaya girildiğinde otomatik olarak yeni bir oda oluşturulur
2. Oda linkini arkadaşlarınızla paylaşın
3. İlk katılan kişi **admin** olur
4. Admin yeni seçenekler ekleyebilir ve kazananı belirleyebilir
5. Tüm değişiklikler **gerçek zamanlı** olarak herkese yansır

---

## 📁 Proje Yapısı
```
hollypolly/
├── app/
│   ├── room/[roomId]/page.tsx    # Oda sayfası
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Ana sayfa (loading)
├── components/
│   ├── UserList.tsx              # Kullanıcı listesi
│   ├── OptionList.tsx            # Seçenek listesi
│   ├── ResultModal.tsx           # Sonuç modalı
│   └── ShareButton.tsx           # Paylaş butonu
├── contexts/
│   ├── UserContext.tsx           # Kullanıcı state
│   └── RoomContext.tsx           # Oda state + Realtime
├── lib/
│   └── supabase/
│       ├── client.ts             # Supabase client
│       └── database.types.ts     # TypeScript tipleri
├── messages/
│   ├── tr.json                   # Türkçe çeviriler
│   └── en.json                   # İngilizce çeviriler
└── supabase/
    └── schema.sql                # Veritabanı şeması
```

---

## 🔄 Realtime Akışı
- **users.onInsert:** Yeni kullanıcı eklendiğinde liste güncellenir
- **users.onUpdate:** Admin değişimi anında yansır
- **options.onInsert:** Yeni seçenek tüm kullanıcılara gönderilir
- **rooms.onUpdate:** Kazanan seçildiğinde sonuç modalı açılır

---

## 🌍 Dil Desteği
URL’ye dil kodu ekleyin:
- Türkçe: `http://localhost:3000/tr`
- İngilizce: `http://localhost:3000/en`

---

## 🚀 Netlify Deployment

### Otomatik Dağıtım
1. Projeyi GitHub’a push edin
2. Netlify’da “New site from Git” seçin
3. Repository’yi seçin
4. Ortam değişkenlerini ekleyin:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Deploy!

### Manuel Deployment

```bash
npm run build
netlify deploy --prod
```

---

## 📝 Lisans
MIT © [Ömer Hodo](https://xhodo.com/)

---

## 🇬🇧 About

Make decisions **with your friends in real time!**
Create a room, invite participants, and pick a winner or loser.

### 🚀 Features
- ✨ Real-time room management
- 👥 Dynamic user list
- ✏️ Editable usernames
- 👑 Admin system (first user is admin, can delegate rights)
- 🗑️ Auto room cleanup when empty
- 🎯 Winner / Loser selection
- 🔄 Restart option
- 🌍 Multi-language support (TR/EN)
- 📱 Responsive layout
- 🎨 Framer Motion animations
- 🔗 Easy link sharing

---

## 🛠️ Technologies
| Technology | Description |
|-------------|-------------|
| **Framework** | Next.js 14 (App Router) |
| **Styling** | Tailwind CSS |
| **Database** | Supabase (PostgreSQL + Realtime) |
| **State Management** | Context API |
| **Animations** | Framer Motion |
| **Localization** | next-intl |
| **Deployment** | Netlify |

---

## 📦 Installation

### 1. Install dependencies
```bash
npm install
```

### 2. Supabase Setup
1. Create an account on [Supabase](https://supabase.com)
2. Create a new project
3. Run `supabase/schema.sql` in the SQL Editor
4. Copy your project URL and anon key from **Project Settings → API**

### 3. Environment Variables
Create `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

---

## 🎮 Usage
1. A new room is created automatically on entry
2. Share the room link with your friends
3. The first participant becomes **admin**
4. Admin can add options and pick a winner
5. All updates sync **instantly** across clients

---

## 📁 Project Structure
```
hollypolly/
├── app/
│   ├── room/[roomId]/page.tsx    # Room page
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Landing/loading page
├── components/
│   ├── UserList.tsx              # User list
│   ├── OptionList.tsx            # Option list
│   ├── ResultModal.tsx           # Result modal
│   └── ShareButton.tsx           # Share button
├── contexts/
│   ├── UserContext.tsx           # User state
│   └── RoomContext.tsx           # Room state + Realtime
├── lib/
│   └── supabase/
│       ├── client.ts             # Supabase client
│       └── database.types.ts     # Type definitions
├── messages/
│   ├── tr.json                   # Turkish translations
│   └── en.json                   # English translations
└── supabase/
    └── schema.sql                # Database schema
```

---

## 🔄 Realtime Event Flow
- **users.onInsert:** Update list when a new user joins
- **users.onUpdate:** Reflect admin change immediately
- **options.onInsert:** Broadcast new option to all users
- **rooms.onUpdate:** Open modal when a winner is selected

---

## 🌍 Language Support
Use URL language codes:
- Turkish: `http://localhost:3000/tr`
- English: `http://localhost:3000/en`

---

## 🚀 Netlify Deployment

### Automatic Deployment
1. Push your code to GitHub
2. On Netlify, select “New site from Git”
3. Choose your repository
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Deploy!

### Manual Deployment
```bash
npm run build
netlify deploy --prod
```

---

## 📝 License
MIT © [Ömer Hod](https://xhodo.com/)
