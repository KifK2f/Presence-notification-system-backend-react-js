import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';


const MatriculePage = () => {
  const [matricule, setMatricule] = useState('');
  const [employee, setEmployee] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [hasPresenceToday, setHasPresenceToday] = useState(false);
  const [showActionSelect, setShowActionSelect] = useState(false);
  // const [selectedAction, setSelectedAction] = useState([]);
  const [selectedAction, setSelectedAction] = useState('');
  const [actionOptions, setActionOptions] = useState([]);




useEffect(() => {
  const fetchActionTypes = async () => {
    try {
      const res = await axios.get('http://192.168.1.70:8080/api/enums/actions');
      setActionOptions(res.data); // tableau de strings ["ARRIVEE", "DEPART"]
    } catch (error) {
      console.error("Erreur lors du chargement des actions", error);
    }
  };

  fetchActionTypes();
}, []);


  


  const handleSubmit = async () => {
  try {
    // const res = await axios.get(`http://192.168.0.109:8080/api/employees/employee/matricule/${matricule}`);
    // setEmployee(res.data.employee);
    // setHasPresenceToday(res.data.hasPresenceToday);
    // const res = await axios.get(`http://192.168.0.109:8080/api/employees/employee/matricule/${matricule}/check-presence`);
    const res = await axios.get(`http://192.168.1.70:8080/api/employees/employee/matricule/${matricule}/check-presence`);
    setEmployee(res.data.employee);
    setHasPresenceToday(res.data.hasPresenceToday);


    if (res.data.hasPresenceToday) {
      setShowActionSelect(true); // Demander action manuellement
    } else {
      // Première fois, on envoie automatiquement "ARRIVEE"
      // await axios.post(`http://192.168.0.109:8080/api/employees/employee/presence`, {
      await axios.post(`http://192.168.1.70:8080/api/employees/employee/presence`, {
        matricule: matricule,
        action: 'ARRIVEE'
      });
      alert('Présence enregistrée automatiquement comme ARRIVEE');
    }

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
          onClick={() => navigate('/list_all_presences')}
          style={styles.button}
        >
          Liste des présences
        </button>

        <div style={{ margin:'10px'}}>          
        </div>

         <button
          onClick={() => navigate('/employes')}
          style={styles.button}
        >
          Gestion des employés
        </button>
      </div>

        {employee && (
          <div style={styles.resultCard}>
            {/* <h3 style={styles.resultTitle}>Informations de l'employé :</h3>
            <p><strong>Nom :</strong> {employee.lastName}</p>
            <p><strong>Prénom :</strong> {employee.firstName}</p>
            <p><strong>Matricule :</strong> {employee.matricule}</p> */}
            <h3>M/Mme {employee.lastName} {employee.firstName}</h3>
          </div>
        )}

        {showActionSelect && (
  <div>
    <p>Vous avez déjà marqué votre présence aujourd’hui. Que voulez-vous faire ?</p>
    {/* <select
      value={selectedAction}
      onChange={(e) => setSelectedAction(e.target.value)}
      style={styles.input}
    >
      <option value="ARRIVEE">ARRIVEE</option>
      <option value="DEPART">DEPART</option>
    </select> */}

<select
  value={selectedAction}
  onChange={(e) => setSelectedAction(e.target.value)}
  style={styles.input}
>
  <option value="" disabled hidden>-- Sélectionner une action --</option>
  {actionOptions.map((action) => (
    <option key={action} value={action}>
      {action}
    </option>
  ))}
</select>



    {/* <button
      onClick={async () => {
        // await axios.post(`http://192.168.0.109:8080/api/employees/employee/presence`, {
        await axios.post(`http://192.168.1.70:8080/api/employees/employee/presence`, {
          matricule,
          action: selectedAction
        });
        alert(`Action ${selectedAction} enregistrée`);
        setShowActionSelect(false);
      }}
      style={styles.button}
    >
      Enregistrer action
    </button> */}

    <button
  onClick={async () => {
    if (!selectedAction) {
      alert('Veuillez sélectionner une action.');
      return;
    }

    try {
      await axios.post(`http://192.168.1.70:8080/api/employees/employee/presence`, {
        matricule,
        action: selectedAction
      });
      alert(`Action ${selectedAction} enregistrée`);
      setShowActionSelect(false);
    } catch (err) {
      console.error("Erreur lors de l'enregistrement de l'action", err);
      alert("Une erreur est survenue lors de l'enregistrement.");
    }
  }}
  style={styles.button}
>
  Enregistrer action
</button>


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

