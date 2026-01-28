-- Table pour stocker les refresh tokens
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id SERIAL PRIMARY KEY,
    userId INTEGER NOT NULL REFERENCES utilisateurs(id) ON DELETE CASCADE,
    token VARCHAR(255) NOT NULL UNIQUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Exemple d'insertion d'un refresh token pour un utilisateur existant (à adapter selon vos users)
-- INSERT INTO refresh_tokens (userId, token) VALUES (1, 'exemple_refresh_token');
