import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MatriculePage from './MatriculePage';
import './App.css';
import EmployeeManager from './EmployeeManager';
import QRCodeGenerator from './QRCodeGenerator';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<QRCodeGenerator />} />
        <Route path="/matricule" element={<MatriculePage />} />
        <Route path="/employes" element={<EmployeeManager />} />
      </Routes>
    </Router>
  );
}

export default App
