ALTER TABLE words ADD COLUMN IF NOT EXISTS subcategory text;
CREATE INDEX IF NOT EXISTS idx_words_category_subcategory ON words(category_id, subcategory);
