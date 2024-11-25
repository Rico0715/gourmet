require('dotenv').config(); 
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
// console.log('DB_USER:', process.env.DB_USER);
// console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
// console.log('DB_NAME:', process.env.DB_NAME);

// Configuration de la connexion à MySQL en utilisant les variables d'environnement
// Configuration du pool de connexions MySQL
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // Ajout des paramètres de timeout pour éviter les erreurs ECONNRESET
  connectTimeout: 10000, // 10 secondes
  acquireTimeout: 10000, // 10 secondes
  timeout: 10000 // 10 secondes
});

// Test de la connexion à la base de données
db.getConnection((err, connection) => {
  if (err) {
    console.error('Erreur de connexion à MySQL:', err);
    process.exit(1);
  } else {
    console.log('Connecté à la base de données MySQL');
    connection.release(); // Libère la connexion
  }
});

// Activer CORS pour autoriser les requêtes depuis ton domaine frontend
app.use(cors({ 
  origin: 'https://resa-lesgourmets.fr/', // Remplace par l'URL de ton site sur Hostinger
}));

// Route pour obtenir tous les produits
app.get('/api/produits', (req, res) => {
  const query = 'SELECT * FROM produits';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Route pour enregistrer une réservation
app.post('/api/reservations', (req, res) => {
  const { phone, selectedDishes, reservationDate, totalPrice } = req.body;

  if (!phone || !selectedDishes || !reservationDate || !totalPrice) {
    return res.status(400).json({ error: 'Tous les champs sont requis' });
  }

  // Pour chaque plat sélectionné, insérer dans la table reservations
  selectedDishes.forEach((dish) => {
    const { id, quantity } = dish; // On assume que chaque plat a un `id` et une `quantity`
    const query = `
      INSERT INTO reservations (produit_id, reservation_date, quantity, phone)
      VALUES (?, ?, ?, ?)
    `;
    db.query(query, [id, reservationDate, quantity, phone], (err, result) => {
      if (err) {
        console.error('Erreur lors de l\'enregistrement de la réservation:', err);
        return res.status(500).json({ error: 'Erreur lors de l\'enregistrement de la réservation' });
      }
    });
  });

  res.status(200).json({ message: 'Commande enregistrée avec succès' });
});

app.get('/api/Mes-reservations', (req, res) => {
  const query = `
    SELECT 
      phone,
      reservation_date,
      GROUP_CONCAT(CONCAT(produit_id, ' (x', quantity, ')') SEPARATOR ', ') AS produits
    FROM 
      reservations
    GROUP BY 
      phone, reservation_date;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des réservations:', err);
      res.status(500).json({ error: 'Erreur serveur' });
    } else {
      res.json(results);
    }
  });
});



// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
