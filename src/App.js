import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import ReservationCard from './Components/ReservationCard';
import OrderSummary from './Components/OrderSummary';
import './App.css';

function App() {
  const [dishes, setDishes] = useState([]);

  // Récupérer les produits depuis le backend
  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const response = await axios.get('https://gourmet-2.onrender.com/api/produits');
        setDishes(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des produits:', error);
      }
    };
    fetchDishes();
  }, []);

  return (
    <Router>
      <Routes>
        {/* Page d'accueil avec une seule carte qui affiche tous les produits */}
        <Route
          path="/"
          element={
            <div className="min-h-screen bg-gray-100 flex flex-wrap justify-center p-8">
              <ReservationCard dishes={dishes} />
            </div>
          }
        />
        {/* Page de récapitulatif de la commande */}
        <Route path="/summary" element={<OrderSummary />} />
      </Routes>
    </Router>
  );
}

export default App;
