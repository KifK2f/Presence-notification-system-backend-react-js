import React, { useState } from 'react';
import { addPresence } from '../services/presenceService';

const AddPresence = () => {
  const [employeeId, setEmployeeId] = useState('');
  const [actionType, setActionType] = useState('');
  const [message, setMessage] = useState('');
  

  const handleSubmit = (e) => {
    e.preventDefault();

    addPresence({
      employee: { id: employeeId },
      actionType: actionType
    })
      .then(() => {
        setMessage("Présence enregistrée !");
        setEmployeeId('');
        setActionType('');
      })
      .catch(error => {
        setMessage(error.response?.data?.message || "Erreur lors de l'enregistrement");
      });
  };

  return (
    <div>
      <h2>Ajouter une présence</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>ID Employé: </label>
          <input type="text" value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} required />
        </div>
        <div>
          <label>Action: </label>
          <select value={actionType} onChange={(e) => setActionType(e.target.value)}>
            <option value="">--Choisir--</option>
            <option value="RETOUR_PAUSE">Retour de pause</option>
            <option value="DEPART">Départ</option>
          </select>
        </div>
        <button type="submit">Valider</button>
        <p>{message}</p>
      </form>
    </div>
  );
};

export default AddPresence;
