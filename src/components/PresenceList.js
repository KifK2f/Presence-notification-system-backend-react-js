import React, { useEffect, useState } from 'react';
import { getAllPresences, deletePresence } from '../services/presenceService';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useNavigate } from 'react-router-dom';



const PresenceList = () => {
  const [presences, setPresences] = useState([]);
  const [searchDate, setSearchDate] = useState('');
  const [searchEmployee, setSearchEmployee] = useState('');
  const [searchHour, setSearchHour] = useState('');
  const [searchAction, setSearchAction] = useState('');
  const [entriesToShow, setEntriesToShow] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  

  const fetchPresences = async () => {
    try {
      const response = await getAllPresences();
      setPresences(response.data.sort((a, b) => new Date(a.date) - new Date(b.date)));
    } catch (error) {
      console.error("Erreur lors du chargement des présences :", error);
    }
  };

  useEffect(() => {
    fetchPresences();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Confirmer la suppression de cette présence ?")) return;
    try {
      await deletePresence(id);
      setPresences(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      alert("Erreur lors de la suppression");
    }
  };

  // Générer les listes uniques pour les filtres déroulants
  const uniqueEmployees = Array.from(new Set(presences.map(p => {
    const fullName = p.employee?.lastName + " " + p.employee?.firstName;
    return fullName || 'N/A';
  })));

  const uniqueHours = Array.from(new Set(presences.map(p => p.hour)));
  const uniqueActions = Array.from(new Set(presences.map(p => p.actionType)));

  // Filtrage multiple
  const filteredPresences = presences.filter(p => {
    const employeeName = p.employee?.lastName + " " + p.employee?.firstName || 'N/A';
    return (
      (searchDate === '' || p.date === searchDate) &&
      (searchEmployee === '' || employeeName === searchEmployee) &&
      (searchHour === '' || p.hour === searchHour) &&
      (searchAction === '' || p.actionType === searchAction)
    );
  });

  // Pagination
  const totalPages = Math.ceil(filteredPresences.length / entriesToShow);
  const startIndex = (currentPage - 1) * entriesToShow;
  const endIndex = startIndex + entriesToShow;
  const paginatedPresences = filteredPresences.slice(startIndex, endIndex);
const exportToPDF = () => {
  const doc = new jsPDF();

  // Titre stylisé
  doc.setFontSize(18);
  doc.setTextColor('#FF6600'); // Orange
  doc.text('État journalier de présences', 105, 16, { align: 'center' });

  const tableColumn = ["Employé", "Date", "Heure", "Action"];
  const tableRows = [];

  filteredPresences.forEach(presence => {
    const employeeName = presence.employee?.lastName + " " + presence.employee?.firstName || 'N/A';
    const rowData = [
      employeeName,
      presence.date,
      presence.hour,
      presence.actionType
    ];
    tableRows.push(rowData);
  });

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 25,
    theme: 'striped',
    styles: {
      fontSize: 10,
      cellPadding: 4,
      halign: 'center',
    },
    headStyles: {
      fillColor: [255, 102, 0], // Orange
      textColor: [255, 255, 255], // Blanc
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [255, 255, 255], // Blanc
    },
    rowStyles: {
      fillColor: [245, 245, 245] // Gris clair
    },
    margin: { top: 30 },
  });

  doc.save("liste_presences.pdf");
};



  // Export Excel 
const exportToExcel = () => {
  const data = filteredPresences.map(presence => ({
    "Employé": presence.employee?.lastName + " " + presence.employee?.firstName || 'N/A',
    "Date": presence.date,
    "Heure": presence.hour,
    "Action": presence.actionType
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Présences");

  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" });

  saveAs(dataBlob, "liste_presences.xlsx");
};


  return (
    <div style={styles.container}>
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#fff9f2',
      minHeight: '100vh'
    }}>
            <div style={styles.headerBar}>
        <button onClick={() => navigate('/matricule')} style={styles.orangeBtn}>
          Aller à l’accueil
        </button>
      </div>

      <h2 style={{ 
        color: '#FF6B00', 
        marginBottom: '15px',
        fontSize: '24px',
        fontWeight: '600'
      }}>
        Liste des présences
      </h2>

      {/* Contrôles supérieurs */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '15px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: '10px', color: '#555' }}>Afficher</span>
            <select
              value={entriesToShow}
              onChange={(e) => setEntriesToShow(Number(e.target.value))}
              style={{
                padding: '6px 10px',
                borderRadius: '4px',
                border: '1px solid #ddd',
                backgroundColor: 'white',
                color: '#333',
                outline: 'none'
              }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span style={{ marginLeft: '10px', color: '#555' }}>entrées</span>
          </div>

          {/* <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: '10px', color: '#555' }}>Statut</span>
            <select
              style={{
                padding: '6px 10px',
                borderRadius: '4px',
                border: '1px solid #ddd',
                backgroundColor: 'white',
                color: '#333',
                outline: 'none'
              }}
            >
              <option>Tous</option>
            </select>
          </div> */}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button 
            onClick={exportToPDF}
            style={{
              padding: '6px 12px',
              borderRadius: '4px',
              border: '1px solid #FF6B00',
              backgroundColor: 'white',
              color: '#FF6B00',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            <span>PDF</span>
          </button>
          <button 
            onClick={exportToExcel}
            style={{
              padding: '6px 12px',
              borderRadius: '4px',
              border: '1px solid #FF6B00',
              backgroundColor: 'white',
              color: '#FF6B00',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            <span>Excel</span>
          </button>
        </div>
      </div>

      {/* Filtres */}
      <div style={{ 
        display: 'flex', 
        gap: '15px',
        marginBottom: '20px',
        flexWrap: 'wrap'
      }}>
        {/* Filtre Date */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ marginRight: '10px', color: '#555' }}>Date</span>
          <input
            type="date"
            value={searchDate}
            onChange={e => setSearchDate(e.target.value)}
            style={{ 
              padding: '6px 10px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              backgroundColor: 'white',
              color: '#333',
              outline: 'none'
            }}
          />
        </div>

        {/* Filtre Employé */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ marginRight: '10px', color: '#555' }}>Employé</span>
          <select
            value={searchEmployee}
            onChange={e => setSearchEmployee(e.target.value)}
            style={{
              padding: '6px 10px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              backgroundColor: 'white',
              color: '#333',
              outline: 'none',
              minWidth: '150px'
            }}
          >
            <option value=''>Tous</option>
            {uniqueEmployees.map((emp, i) => (
              <option key={i} value={emp}>{emp}</option>
            ))}
          </select>
        </div>

        {/* Filtre Action */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ marginRight: '10px', color: '#555' }}>Action</span>
          <select
            value={searchAction}
            onChange={e => setSearchAction(e.target.value)}
            style={{
              padding: '6px 10px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              backgroundColor: 'white',
              color: '#333',
              outline: 'none'
            }}
          >
            <option value=''>Toutes</option>
            {uniqueActions.map((action, i) => (
              <option key={i} value={action}>{action}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tableau */}
      <div style={{ 
        overflowX: 'auto',
        marginBottom: '20px',
        borderRadius: '4px',
        border: '1px solid #eee'
      }}>
        <table style={{ 
          width: '100%',
          borderCollapse: 'collapse'
        }}>
          <thead>
            <tr style={{ 
              backgroundColor: '#FF6B00',
              color: 'white'
            }}>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: '500' }}>Employé</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: '500' }}>Date</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: '500' }}>Heure</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: '500' }}>Action</th>
              <th style={{ padding: '12px', textAlign: 'center', fontWeight: '500' }}>Options</th>
            </tr>
          </thead>
          <tbody>
            {paginatedPresences.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ 
                  padding: '20px',
                  textAlign: 'center',
                  color: '#888',
                  fontStyle: 'italic'
                }}>
                  Aucune présence trouvée
                </td>
              </tr>
            ) : (
              paginatedPresences.map((p, index) => (
                <tr key={p.id} style={{ 
                  borderBottom: '1px solid #eee',
                  backgroundColor: index % 2 === 0 ? 'white' : '#FFF9F2'
                }}>
                  <td style={{ padding: '12px', color: '#333' }}>
                    {p.employee?.lastName + " " + p.employee?.firstName || 'N/A'}
                  </td>
                  {/* <td style={{ padding: '12px', color: '#333' }}>
                    {p.date}
                  </td> */}
                    <td style={{ padding: '12px', color: '#333' }}>
                    {new Date(p.date).toLocaleDateString('fr-FR')}
                    </td>

                  <td style={{ padding: '12px', color: '#333' }}>
                    {p.hour}
                  </td>
                  <td style={{ padding: '12px', color: '#333' }}>
                    {p.actionType}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <button 
                      onClick={() => handleDelete(p.id)} 
                      style={{ 
                        backgroundColor: '#FF3D00',
                        color: 'white',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: '400',
                        transition: 'all 0.3s'
                      }}
                      onMouseOver={(e) => e.target.style.backgroundColor = '#E53935'}
                      onMouseOut={(e) => e.target.style.backgroundColor = '#FF3D00'}
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination et informations */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '15px'
      }}>
        <div style={{ color: '#555' }}>
          Affichage de {startIndex + 1} à {Math.min(endIndex, filteredPresences.length)} sur {filteredPresences.length} entrées
        </div>

        <div style={{ display: 'flex', gap: '5px' }}>
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            style={{
              padding: '6px 10px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              backgroundColor: currentPage === 1 ? '#f5f5f5' : 'white',
              color: currentPage === 1 ? '#aaa' : '#333',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
            }}
          >
            Précédent
          </button>

          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }

            return (
              <button
                key={i}
                onClick={() => setCurrentPage(pageNum)}
                style={{
                  padding: '6px 10px',
                  borderRadius: '4px',
                  border: '1px solid #ddd',
                  backgroundColor: currentPage === pageNum ? '#FF6B00' : 'white',
                  color: currentPage === pageNum ? 'white' : '#333',
                  cursor: 'pointer'
                }}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            style={{
              padding: '6px 10px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              backgroundColor: currentPage === totalPages ? '#f5f5f5' : 'white',
              color: currentPage === totalPages ? '#aaa' : '#333',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
            }}
          >
            Suivant
          </button>
        </div>
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
    orangeBtn: {
    padding: '10px 20px',
    backgroundColor: '#E66C26',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};
export default PresenceList;
