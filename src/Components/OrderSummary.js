import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const OrderSummary = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedDishes, reservationDate } = location.state || {};
  const [phone, setPhone] = useState(''); // État pour le numéro de téléphone

  if (!selectedDishes || selectedDishes.length === 0) {
    return <p>Aucune réservation n'a été trouvée.</p>;
  }

  // Calculer le total pour chaque plat en fonction de la quantité
  const calculateTotalPrice = (dish) => dish.price * dish.quantity;

  // Calculer le total général de la commande
  const totalOrderPrice = selectedDishes.reduce((acc, dish) => {
    return acc + calculateTotalPrice(dish);
  }, 0);

  // Fonction pour enregistrer la commande
  const handleSubmit = async () => {
    if (!phone) {
      alert('Veuillez entrer un numéro de téléphone.');
      return;
    }

    const orderData = {
      phone,
      selectedDishes,
      reservationDate,
      totalPrice: totalOrderPrice,
    };

    try {
      const response = await fetch('http://localhost:5000/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        alert('Commande enregistrée avec succès !');
        navigate('/'); // Rediriger vers la page d'accueil après la commande
      } else {
        alert('Erreur lors de la sauvegarde de la commande.');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Une erreur est survenue lors de la connexion au serveur.');
    }
  };

  return (
    <div className="summary">
      <h1>Récapitulatif de la commande</h1>
      <p>
        <strong>Date de réservation :</strong> {reservationDate}
      </p>

      {selectedDishes.map((dish, index) => (
        <div key={index} className="summary-item">
          <h2>{dish.name}</h2>
          <p>
            <strong>Prix unitaire :</strong> {dish.price} €
          </p>
          <p>
            <strong>Quantité :</strong> {dish.quantity}
          </p>
          <p>
            <strong>Total :</strong> {calculateTotalPrice(dish).toFixed(2)} €
          </p>
          <hr />
        </div>
      ))}

      {/* Afficher le prix total de la commande */}
      <div className="total-summary">
        <h2>Total de la commande : {totalOrderPrice.toFixed(2)} €</h2>
      </div>

      {/* Champ pour entrer le numéro de téléphone */}
      <div>
      <h2>Le paiement se fera en espèces. Merci de votre compréhension.</h2>
        <label>
          <strong>Numéro de téléphone :</strong>
        </label>
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Entrez votre numéro de téléphone"
        />
      </div>
      <div className="buttons-container"></div>
      {/* Bouton pour soumettre la commande */}
      <button onClick={handleSubmit} className="submit-btn">
        Confirmer la commande
      </button>

      <button onClick={() => navigate('/')} className="back-btn">
        Retour
      </button>
    </div>
  );
};

export default OrderSummary;
