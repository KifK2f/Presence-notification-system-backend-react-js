import React, { useState } from 'react';
import axios from 'axios';

const MatriculePage = () => {
  const [matricule, setMatricule] = useState('');
  const [employee, setEmployee] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/employees/employee/matricule/${matricule}`);
      setEmployee(res.data);
      setError('');
    } catch (err) {
      setEmployee(null);
      setError('Matricule introuvable.');
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Bienvenue !</h1>
      <p>Veuillez entrer votre matricule :</p>
      <input
        type="text"
        value={matricule}
        onChange={(e) => setMatricule(e.target.value)}
        placeholder="Entrez votre matricule"
        style={{
          padding: '10px',
          fontSize: '16px',
          borderRadius: '5px',
          border: '1px solid #ccc',
          marginTop: '10px'
        }}
      />
      <br />
      <button
        onClick={handleSubmit}
        style={{
          marginTop: '15px',
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Valider
      </button>

      {employee && (
        <div style={{ marginTop: '20px' }}>
          <h3>Informations de l'employé :</h3>
          <p><strong>Nom :</strong> {employee.lastName}</p>
          <p><strong>Prénom :</strong> {employee.firstName}</p>
          <p><strong>Matricule :</strong> {employee.matricule}</p>
        </div>
      )}

      {error && <p style={{ color: 'red', marginTop: '20px' }}>{error}</p>}
    </div>
  );
};

export default MatriculePage;


// import React from 'react';

// const MatriculePage = () => {
//   return (
//     <div style={{ textAlign: 'center', marginTop: '50px' }}>
//       <h1>Bienvenue !</h1>
//       <p>Veuillez entrer votre matricule :</p>
//       <input
//         type="text"
//         placeholder="Entrez votre matricule"
//         style={{
//           padding: '10px',
//           fontSize: '16px',
//           borderRadius: '5px',
//           border: '1px solid #ccc',
//           marginTop: '10px'
//         }}
//       />
//     </div>
//   );
// };

// export default MatriculePage;
