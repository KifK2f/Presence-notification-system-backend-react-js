import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// const API_URL = "http://192.168.0.109:8080/api/employees";
const API_URL = "http://192.168.1.70:8080/api/employees";

const EmployeeManager = () => {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({ firstName: '', lastName: '', matricule: '' });
  const [editId, setEditId] = useState(null);
  const [isEditingMatricule, setIsEditingMatricule] = useState(false);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(`${API_URL}/employees`);
      setEmployees(res.data.sort((a, b) => a.id - b.id));
    } catch (err) {
      console.error("Erreur lors du chargement :", err);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const isDuplicateNameCombination = (firstName, lastName) => {
    const combo = `${firstName.trim().toLowerCase()} ${lastName.trim().toLowerCase()}`;
    return employees.some(emp =>
      `${emp.firstName.trim().toLowerCase()} ${emp.lastName.trim().toLowerCase()}` === combo
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName) {
      alert("Veuillez remplir tous les champs.");
      return;
    }
    if (editId === null && isDuplicateNameCombination(form.firstName, form.lastName)) {
      alert("Cette combinaison prénom/nom existe déjà !");
      return;
    }
    try {
      if (editId === null) {
        await axios.post(`${API_URL}/employees`, form);
      } else {
        await axios.put(`${API_URL}/employee/${editId}`, form);
        setEditId(null);
        setIsEditingMatricule(false);
      }
      setForm({ firstName: '', lastName: '', matricule: '' });
      fetchEmployees();
    } catch (err) {
      console.error('Erreur lors de l’enregistrement :', err);
      alert('Erreur lors de l’enregistrement');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Confirmer la suppression de cet employé ?")) return;
    try {
      await axios.delete(`${API_URL}/employee/${id}`);
      fetchEmployees();
    } catch (err) {
      console.error("Erreur lors de la suppression :", err);
    }
  };

  const handleEdit = (emp) => {
    setForm({ lastName: emp.lastName, firstName: emp.firstName, matricule: emp.matricule || '' });
    setEditId(emp.id);
    setIsEditingMatricule(true);
  };

  const filteredEmployees = employees.filter(emp =>
    emp.firstName.toLowerCase().includes(search.toLowerCase()) ||
    emp.lastName.toLowerCase().includes(search.toLowerCase()) ||
    (emp.matricule && emp.matricule.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div style={styles.container}>
      <div style={styles.headerBar}>
        <button onClick={() => navigate('/matricule')} style={styles.orangeBtn}>
          Aller à l’accueil
        </button>
        <h2 style={styles.title}>Gestion des Employés</h2>
      </div>

      <div style={styles.topBar}>
        <div style={styles.totalCount}>Total : {filteredEmployees.length} employé(s)</div>
        <input
          type="text"
          placeholder="Rechercher par nom, prénom, matricule..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.searchInput}
        />
      </div>

      <div style={styles.panel}>
        <div style={styles.panelHeader}>Ajouter / Modifier Employé</div>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            placeholder="Nom"
            value={form.lastName}
            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            style={styles.input}
            required
          />
          <input
            type="text"
            placeholder="Prénom"
            value={form.firstName}
            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            style={styles.input}
            required
          />
          {isEditingMatricule && (
            <input
              type="text"
              placeholder="Matricule"
              value={form.matricule}
              onChange={(e) => setForm({ ...form, matricule: e.target.value })}
              style={styles.input}
            />
          )}
          <button type="submit" style={styles.submitBtn}>
            {editId ? "Modifier" : "Ajouter"}
          </button>
        </form>
      </div>

      <div style={styles.panel}>
        <div style={styles.panelHeader}>Liste des Employés</div>
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Nom</th>
                <th style={styles.th}>Prénom</th>
                <th style={styles.th}>Matricule</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan="4" style={styles.noResult}>Aucun employé trouvé</td>
                </tr>
              ) : (
                filteredEmployees.map(emp => (
                  <tr key={emp.id}>
                    <td style={styles.td}>{emp.lastName}</td>
                    <td style={styles.td}>{emp.firstName}</td>
                    <td style={styles.td}>{emp.matricule}</td>
                    <td style={styles.td}>
                      <button onClick={() => handleEdit(emp)} style={styles.btnEdit}>Modifier</button>
                      <button onClick={() => handleDelete(emp.id)} style={styles.btnDelete}>Supprimer</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Styles avec responsive design
const styles = {
  container: {
    padding: '20px',
    background: '#fff9f2',
    fontFamily: 'Segoe UI',
    minHeight: '100vh',
  },
  headerBar: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '20px',
  },
  title: {
    color: '#E66C26',
    margin: 0,
    fontSize: '24px',
    textAlign: 'center',
  },
  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '10px',
    marginBottom: '20px',
  },
  totalCount: {
    fontSize: '16px',
    color: '#E66C26',
    fontWeight: 'bold',
  },
  searchInput: {
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    flex: '1',
    maxWidth: '300px',
  },
  panel: {
    background: '#fff',
    borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    marginBottom: '30px',
    overflowX: 'auto',
  },
  panelHeader: {
    backgroundColor: '#E66C26',
    color: 'white',
    padding: '15px',
    fontSize: '18px',
    fontWeight: 'bold',
    borderTopLeftRadius: '10px',
    borderTopRightRadius: '10px',
  },
  form: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    padding: '20px',
    justifyContent: 'center',
  },
  input: {
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    width: '100%',
    maxWidth: '250px',
  },
  submitBtn: {
    padding: '10px 20px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  orangeBtn: {
    padding: '10px 20px',
    backgroundColor: '#E66C26',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    minWidth: '600px',
  },
  th: {
    padding: '12px',
    backgroundColor: '#ffe7d6',
    color: '#333',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  td: {
    padding: '10px',
    borderBottom: '1px solid #eee',
    textAlign: 'center',
  },
  btnEdit: {
    backgroundColor: '#ffc107',
    color: 'white',
    border: 'none',
    padding: '6px 10px',
    borderRadius: '4px',
    marginRight: '5px',
    cursor: 'pointer',
  },
  btnDelete: {
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    padding: '6px 10px',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  noResult: {
    padding: '20px',
    color: '#888',
    textAlign: 'center',
  },
};

export default EmployeeManager;



