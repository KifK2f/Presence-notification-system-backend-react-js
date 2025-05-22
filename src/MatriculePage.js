import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MatriculePage = () => {
  const [matricule, setMatricule] = useState('');
  const [employee, setEmployee] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  

  const handleSubmit = async () => {
    try {
      // const res = await axios.get(`http://192.168.1.70:8080/api/employees/employee/matricule/${matricule}`);
      const res = await axios.get(`http://192.168.0.109:8080/api/employees/employee/matricule/${matricule}`);
      setEmployee(res.data);
      setError('');
    } catch (err) {
      setEmployee(null);
      setError('Matricule introuvable.');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Bienvenue !</h1>
        <p style={styles.subtitle}>Veuillez entrer votre matricule :</p>

        <input
          type="text"
          value={matricule}
          onChange={(e) => setMatricule(e.target.value)}
          placeholder="Entrez votre matricule"
          style={styles.input}
        />
        <button onClick={handleSubmit} style={styles.button}>
          Valider
        </button>
        
        <div style={{display: 'flex', justifyContent: 'space-between', marginTop:'10px'}}>
        <button
          onClick={() => navigate('/matricule')}
          style={styles.button}
        >
          Aller à l’accueil
        </button>

        <div style={{ margin:'10px'}}>          
        </div>

         <button
          onClick={() => navigate('/matricule')}
          style={styles.button}
        >
          Aller à l’accueil
        </button>
      </div>

        {employee && (
          <div style={styles.resultCard}>
            {/* <h3 style={styles.resultTitle}>Informations de l'employé :</h3>
            <p><strong>Nom :</strong> {employee.lastName}</p>
            <p><strong>Prénom :</strong> {employee.firstName}</p>
            <p><strong>Matricule :</strong> {employee.matricule}</p> */}
            <h3>Bon arrivée M/Mme {employee.lastName} {employee.firstName}</h3>
          </div>
        )}

        {error && <p style={styles.error}>{error}</p>}
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#E65D0EDA',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px'
  },
  card: {
    backgroundColor: '#ffffff',
    padding: '40px',
    borderRadius: '10px',
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
    maxWidth: '500px',
    width: '100%',
    textAlign: 'center'
  },
  title: {
    marginBottom: '10px',
    fontSize: '28px',
    color: '#333'
  },
  subtitle: {
    marginBottom: '20px',
    fontSize: '16px',
    color: '#666'
  },
  input: {
    width: '100%',
    padding: '12px',
    fontSize: '16px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    marginBottom: '15px'
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#F75C03FF',
    color: 'white',
    fontSize: '16px',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background 0.3s ease'
  },
  resultCard: {
    marginTop: '30px',
    padding: '20px',
    borderRadius: '10px',
    backgroundColor: '#f9f9f9',
    border: '1px solid #ddd',
    textAlign: 'left'
  },
  resultTitle: {
    marginBottom: '10px',
    fontSize: '18px',
    color: '#444'
  },
  error: {
    color: '#ff4d4f',
    marginTop: '20px',
    fontWeight: 'bold'
  }
};


export default MatriculePage;

