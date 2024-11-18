// const db = require('../db');

// // Fonction pour créer une nouvelle réservation
// exports.createReservation = (req, res) => {
//   const { client_id, produit_id, reservation_date, quantity } = req.body;

//   if (!client_id || !produit_id || !reservation_date || !quantity) {
//     return res.status(400).json({ error: 'Tous les champs sont requis' });
//   }

//   const query = `
//     INSERT INTO reservations (client_id, produit_id, reservation_date, quantity)
//     VALUES (?, ?, ?, ?)
//   `;

//   db.query(query, [client_id, produit_id, reservation_date, quantity], (err, result) => {
//     if (err) {
//       console.error('Erreur lors de l\'insertion dans la table reservations:', err);
//       return res.status(500).json({ error: 'Erreur lors de la sauvegarde de la réservation' });
//     }
//     res.status(200).json({ message: 'Commande enregistrée avec succès' });
//   });
// };
