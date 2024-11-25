import React, { useState, useEffect } from 'react';
import './ReservationTable.css'
const ReservationsTable = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Récupération des données via l'API
    const fetchReservations = async () => {
      try {
        const response = await fetch('https://gourmet-2.onrender.com/api/Mes-reservations');
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des données');
        }
        const data = await response.json();
        setReservations(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  if (loading) return <p>Chargement des réservations...</p>;
  if (error) return <p>Erreur : {error}</p>;

  return (
    <div>
      <h2>Liste des Réservations</h2>
      <table>
        <thead>
          <tr>
            <th>Téléphone</th>
            <th>Date de réservation</th>
            <th>Produits</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((reservation, index) => (
            <tr key={index}>
              <td>{reservation.phone}</td>
              <td>{reservation.reservation_date}</td>
              <td>{reservation.produits}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReservationsTable;
