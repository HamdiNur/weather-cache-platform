-- =========================================
-- Weather Cache Platform — Database Schema
-- =========================================

-- USERS
CREATE TABLE IF NOT EXISTS users (
    id            SERIAL PRIMARY KEY,
    username      VARCHAR(50)  NOT NULL UNIQUE,
    email         VARCHAR(255) NOT NULL UNIQUE,
    password      VARCHAR(255) NOT NULL,          -- stores the bcrypt hash, never plain text
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- FAVORITES
CREATE TABLE IF NOT EXISTS favorites (
    id            SERIAL PRIMARY KEY,
    user_id       INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    city          VARCHAR(100) NOT NULL,
    country       VARCHAR(100),
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, city)                        -- prevents saving the same city twice for one user
);

-- SEARCH HISTORY
CREATE TABLE IF NOT EXISTS search_history (
    id            SERIAL PRIMARY KEY,
    user_id       INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    city          VARCHAR(100) NOT NULL,
    searched_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Helpful indexes for common queries
CREATE INDEX IF NOT EXISTS idx_favorites_user_id       ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_search_history_user_id  ON search_history(user_id);
CREATE INDEX IF NOT EXISTS idx_search_history_searched_at ON search_history(searched_at DESC);