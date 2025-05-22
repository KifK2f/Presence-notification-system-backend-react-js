import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MatriculePage from './MatriculePage';
import './App.css';
import EmployeeManager from './EmployeeManager';
import QRCodeGenerator from './QRCodeGenerator';
import PresenceList from './components/PresenceList';
import AddPresence from './components/AddPresence';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<QRCodeGenerator />} />
        <Route path="/matricule" element={<MatriculePage />} />
        <Route path="/employes" element={<EmployeeManager />} />
        <Route path="/list_all_presences" element={<PresenceList />} />
        <Route path="/add_presence" element={<AddPresence />} />
      </Routes>
    </Router>
  );
}

export default App
