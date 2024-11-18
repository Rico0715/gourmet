import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ReservationCard = ({ dishes }) => {
  const navigate = useNavigate();

  // Date de réservation fixée au 2 décembre
  const [selectedDate, setSelectedDate] = useState('2024-12-02');

  const [selectedQuantities, setSelectedQuantities] = useState(
    dishes.reduce((acc, dish) => {
      acc[dish.id] = 0; // Initialiser toutes les quantités à 0
      return acc;
    }, {})
  );

  const handleQuantityChange = (id, event) => {
    setSelectedQuantities({
      ...selectedQuantities,
      [id]: parseInt(event.target.value),
    });
  };

  const handleReservation = () => {
    const selectedDishes = dishes
      .map((dish) => ({
        ...dish,
        quantity: selectedQuantities[dish.id],
      }))
      .filter((dish) => dish.quantity > 0);

    if (selectedDishes.length > 0) {
      navigate('/summary', {
        state: {
          selectedDishes,
          reservationDate: selectedDate,
        },
      });
    } else {
      alert('Veuillez sélectionner au moins un produit.');
    }
  };

  return (
    <div className="card">
      <h1>Nos Produits</h1>

      {/* Date de réservation fixée au 2 décembre et non modifiable */}
      <label htmlFor="reservation-date">Date de réservation :</label>
      <input
        type="date"
        id="reservation-date"
        value={selectedDate}
        disabled // Rendre le champ non modifiable
        className="date-input"
      />

      <div className="products-list">
        {dishes.map((dish) => (
          <div key={dish.id} className="dish">
            {/* Vérification si l'image existe, sinon affiche une image par défaut */}
            <div className="image-container">
              <img
                className="fixed-size"
                src={dish.image ? dish.image : '/images/default.png'}
                alt={dish.name}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/images/default.png'; // Image par défaut si l'image n'est pas trouvée
                }}
              />
            </div>

            <div className="py-4">
              <h2 className="dish-name">{dish.name}</h2>
              <p><strong>Prix :</strong> {dish.price} €</p>
              <p><strong>Ingrédients :</strong> {dish.ingredients || 'Non spécifié'}</p>

              <label htmlFor={`quantity-${dish.id}`} className="mt-4">Quantité :</label>
              <select
                id={`quantity-${dish.id}`}
                value={selectedQuantities[dish.id]}
                onChange={(e) => handleQuantityChange(dish.id, e)}
                className="quantity-select"
              >
                {Array.from({ length: 11 }, (_, i) => i).map((qty) => (
                  <option key={qty} value={qty}>
                    {qty}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>

      <button className="reserve-btn" onClick={handleReservation}>
        Réserver toute la commande
      </button>
    </div>
  );
};

export default ReservationCard;
