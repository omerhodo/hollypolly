-- Supabase veritabanı şeması - CLEAN INSTALL
-- Bu SQL'i Supabase Dashboard'da SQL Editor'de çalıştırın
-- Tabloları sıfırdan oluşturur

-- 1. Tabloları sıfırdan oluştur
CREATE TABLE IF NOT EXISTS rooms (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  result JSONB DEFAULT NULL,
  title TEXT
);

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  avatar TEXT NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE,
  room_id TEXT NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id TEXT NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. İndeksler
CREATE INDEX IF NOT EXISTS users_room_id_idx ON users(room_id);
CREATE INDEX IF NOT EXISTS options_room_id_idx ON options(room_id);

-- 3. RLS (Row Level Security) Politikaları
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE options ENABLE ROW LEVEL SECURITY;

-- 4. Politikaları oluştur
-- Herkes okuyabilir
CREATE POLICY "Rooms are viewable by everyone" ON rooms
  FOR SELECT USING (true);

CREATE POLICY "Users are viewable by everyone" ON users
  FOR SELECT USING (true);

CREATE POLICY "Options are viewable by everyone" ON options
  FOR SELECT USING (true);

CREATE POLICY "Anyone can create rooms" ON rooms
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can create users" ON users
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can create options" ON options
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update rooms" ON rooms
  FOR UPDATE USING (true);

CREATE POLICY "Anyone can update users" ON users
  FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete options" ON options
  FOR DELETE USING (true);

CREATE POLICY "Anyone can delete users" ON users
  FOR DELETE USING (true);

-- 5. Realtime için publication
ALTER PUBLICATION supabase_realtime ADD TABLE rooms;
ALTER PUBLICATION supabase_realtime ADD TABLE users;
ALTER PUBLICATION supabase_realtime ADD TABLE options;

-- 6. Boş odaları 5 dakika sonra temizleyen fonksiyon
CREATE OR REPLACE FUNCTION cleanup_empty_rooms()
RETURNS void AS $$
BEGIN
  -- 5 dakikadan uzun süredir kullanıcısı olmayan odaları sil
  DELETE FROM rooms
  WHERE id IN (
    SELECT r.id
    FROM rooms r
    LEFT JOIN users u ON u.room_id = r.id
    WHERE u.id IS NULL
    AND r.last_activity < NOW() - INTERVAL '5 minutes'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- İnaktif kullanıcıları temizleyen fonksiyon (2 dakikadan uzun süredir görülmeyenler)
CREATE OR REPLACE FUNCTION cleanup_inactive_users()
RETURNS void AS $$
BEGIN
  DELETE FROM users
  WHERE last_seen < NOW() - INTERVAL '2 minutes';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Room activity'yi güncelleyen trigger
CREATE OR REPLACE FUNCTION update_room_activity()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE rooms
  SET last_activity = NOW()
  WHERE id = COALESCE(NEW.room_id, OLD.room_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 7. Trigger'ları oluştur
CREATE TRIGGER update_room_activity_on_user_change
AFTER INSERT OR UPDATE OR DELETE ON users
FOR EACH ROW
EXECUTE FUNCTION update_room_activity();

CREATE TRIGGER update_room_activity_on_option_change
AFTER INSERT OR UPDATE OR DELETE ON options
FOR EACH ROW
EXECUTE FUNCTION update_room_activity();

-- 8. CRON Job kurulumu için komutlar
-- NOT: Supabase Dashboard'da SQL Editor'de ayrıca şunu çalıştırın:
-- SELECT cron.schedule('cleanup-empty-rooms', '* * * * *', 'SELECT cleanup_empty_rooms();');
-- SELECT cron.schedule('cleanup-inactive-users', '* * * * *', 'SELECT cleanup_inactive_users();');
