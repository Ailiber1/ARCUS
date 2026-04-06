-- ARCUS コーポレートサイト用テーブル
-- Previo Supabaseプロジェクトに相乗り（テーブル名にarcus_プレフィックス）
-- 実行: Supabase Dashboard > SQL Editor

-- ========================================
-- 1. arcus_news（お知らせ）
-- ========================================
CREATE TABLE IF NOT EXISTS public.arcus_news (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  date text NOT NULL,
  category text NOT NULL CHECK (category IN ('Notice', 'Achievement', 'Service', 'Media', 'Recruit')),
  title text NOT NULL,
  content text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- RLS有効化
ALTER TABLE public.arcus_news ENABLE ROW LEVEL SECURITY;

-- anon: 公開記事の読み取りのみ許可
CREATE POLICY "Anyone can read published news"
  ON public.arcus_news FOR SELECT TO anon
  USING (is_published = true);

-- authenticated: 全操作許可（管理用）
CREATE POLICY "Admin full access on arcus_news"
  ON public.arcus_news FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- ========================================
-- 2. arcus_contacts（問い合わせ）
-- ========================================
CREATE TABLE IF NOT EXISTS public.arcus_contacts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  company text NOT NULL CHECK (char_length(company) <= 100),
  name text NOT NULL CHECK (char_length(name) <= 50),
  email text NOT NULL CHECK (char_length(email) <= 100),
  phone text CHECK (char_length(phone) <= 20),
  inquiry_type text NOT NULL,
  message text NOT NULL CHECK (char_length(message) <= 2000),
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'done')),
  created_at timestamptz DEFAULT now()
);

-- RLS有効化
ALTER TABLE public.arcus_contacts ENABLE ROW LEVEL SECURITY;

-- anon: 書き込みのみ許可（読み取り不可 = 他人の問い合わせを見れない）
CREATE POLICY "Anyone can submit contact"
  ON public.arcus_contacts FOR INSERT TO anon
  WITH CHECK (true);

-- authenticated: 全操作許可（管理用）
CREATE POLICY "Admin full access on arcus_contacts"
  ON public.arcus_contacts FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- ========================================
-- 3. 初期ニュースデータ投入
-- ========================================
INSERT INTO public.arcus_news (date, category, title, content, sort_order) VALUES
  ('2025.04.01', 'Notice', 'ゴールデンウィーク休業のお知らせ（4/29〜5/6）',
   '平素よりARCUSをご愛顧いただき、誠にありがとうございます。誠に勝手ながら、下記の期間を休業とさせていただきます。休業期間: 2025年4月29日（火）〜 5月6日（火）。休業期間中のお問い合わせにつきましては、5月7日（水）以降に順次ご対応いたします。', 8),

  ('2025.03.15', 'Achievement', '支援企業数が180社を突破しました',
   '2019年の創業以来、中小企業のDX支援に取り組んでまいりましたARCUSですが、おかげさまで支援企業数が180社を突破いたしました。これもひとえに、お客様からのご信頼の賜物です。今後も一社一社に寄り添った支援を続けてまいります。', 7),

  ('2025.02.20', 'Media', '日経クロステックに当社の取り組みが掲載されました',
   '日経クロステックにて、当社の中小企業向けDX支援の取り組みが紹介されました。コスト削減だけではない、現場の業務改善に直結するDXというテーマで、実際の導入事例を交えてご紹介いただいています。', 6),

  ('2025.01.10', 'Service', 'IT顧問サービスに「セキュリティ診断」オプションを追加',
   'IT顧問サービスをご契約のお客様向けに、新たに「セキュリティ診断」オプションを追加いたしました。お客様のシステム環境を定期的に診断し、脆弱性の早期発見と対策をサポートします。月額5万円（税別）にてご提供いたします。', 5),

  ('2024.12.01', 'Notice', '年末年始休業のお知らせ（12/28〜1/5）',
   '平素よりARCUSをご利用いただき、ありがとうございます。休業期間: 2024年12月28日（土）〜 2025年1月5日（日）。1月6日（月）より通常営業いたします。', 4),

  ('2024.10.15', 'Recruit', '2025年度の新卒・中途採用を開始しました',
   'ARCUSでは、2025年度の新卒・中途採用を開始いたしました。DXコンサルタント、システムエンジニア、プロジェクトマネージャーを募集しています。', 3),

  ('2024.09.01', 'Achievement', '製造業向け在庫管理システムの導入事例を公開',
   '製造業A社様にて導入いただいた在庫管理システムの事例を公開しました。導入前は手作業で行っていた在庫管理をデジタル化し、在庫差異80%削減、棚卸作業時間50%削減を達成しました。', 2),

  ('2024.07.20', 'Service', 'DX戦略コンサルティングの無料相談枠を拡大しました',
   'ご好評いただいておりますDX戦略コンサルティングの無料相談枠を、月間10社から20社に拡大いたしました。お気軽にご相談ください。', 1);
