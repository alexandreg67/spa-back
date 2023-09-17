-- Utilisateur table
CREATE TABLE Utilisateur (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    prenom VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    mot_de_passe VARCHAR(255) NOT NULL,
    telephone VARCHAR(20),
    status VARCHAR(50) DEFAULT 'en_attente', -- peut être 'en_attente', 'actif', 'inactif' TODO: à voir si on garde 'inactif'
    date_inscription TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP  -- Pour le soft delete
);

-- Role table
CREATE TABLE Role (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(255) NOT NULL UNIQUE
);

-- Utilisateur and Role relation table
CREATE TABLE Utilisateur_Role (
    user_id INT REFERENCES Utilisateur(id) ON DELETE SET NULL, -- ON DELETE SET NULL pour pouvoir supprimer un utilisateur sans supprimer son role
    role_id INT REFERENCES Role(id) ON DELETE SET NULL, -- ON DELETE SET NULL pour pouvoir supprimer un role sans supprimer l'utilisateur
    PRIMARY KEY(user_id, role_id)
);

-- Chien table
CREATE TABLE Chien (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    race VARCHAR(255),
    age INT,
    difficulte INT CHECK (difficulty >= 1 AND difficulty <= 3), -- niveau de difficulté
    deleted_at TIMESTAMP  -- Pour le soft delete
);

-- Creneau table
CREATE TABLE Creneau (
    id SERIAL PRIMARY KEY,
    date_debut TIMESTAMP NOT NULL,
    date_fin TIMESTAMP NOT NULL,
    status VARCHAR(50) DEFAULT 'libre', -- peut être 'libre', 'reserve', 'complet'
    deleted_at TIMESTAMP  -- Pour le soft delete
);

-- Activite table
CREATE TABLE Activite (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    description VARCHAR(255) NOT NULL,
);

-- Chien and Creneau relation table
CREATE TABLE Chien_Creneau (
    chien_id INT REFERENCES Chien(id) ON DELETE SET NULL, -- ON DELETE SET NULL pour pouvoir supprimer un chien sans supprimer son creneau
    creneau_id INT REFERENCES Creneau(id) ON DELETE SET NULL, -- ON DELETE SET NULL pour pouvoir supprimer un creneau sans supprimer le chien
    PRIMARY KEY(chien_id, creneau_id)
);

-- Creneau and Activite relation table
CREATE TABLE Creneau_Activite (
    creneau_id INT REFERENCES Creneau(id) ON DELETE SET NULL, -- ON DELETE SET NULL pour pouvoir supprimer un creneau sans supprimer l'activite
    activite_id INT REFERENCES Activite(id) ON DELETE SET NULL, -- ON DELETE SET NULL pour pouvoir supprimer une activite sans supprimer le creneau
    PRIMARY KEY(creneau_id, activite_id)
);

-- Utilisateur and Chien relation table (for interactions)
CREATE TABLE Utilisateur_Chien (
    user_id INT REFERENCES Utilisateur(id) ON DELETE SET NULL, -- ON DELETE SET NULL pour pouvoir supprimer un utilisateur sans supprimer son chien
    chien_id INT REFERENCES Chien(id) ON DELETE SET NULL, -- ON DELETE SET NULL pour pouvoir supprimer un chien sans supprimer l'utilisateur
    date_interaction TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(user_id, chien_id, date_interaction)
);

-- Insert roles
INSERT INTO Role(name) VALUES ('super_admin'), ('admin'), ('soigneur'), ('benevole');