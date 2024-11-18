require('dotenv').config(); 
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_NAME:', process.env.DB_NAME);

// Configuration de la connexion à MySQL en utilisant les variables d'environnement
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});


// Connexion à la base de données

db.connect((err) => {
  if (err) {
    console.error('Erreur de connexion à MySQL:', err);
    process.exit(1); // Arrête le serveur si la connexion échoue
  } else {
    console.log('Connecté à la base de données MySQL');
  }
});


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

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
