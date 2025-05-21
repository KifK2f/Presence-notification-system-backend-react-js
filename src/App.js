import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MatriculePage from './MatriculePage';
import './App.css';

import QRCodeGenerator from './QRCodeGenerator';

// function App() {
//   return (
//     <div className="App">
//       <QRCodeGenerator />
//     </div>
//   );
// }

// export default App;

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<QRCodeGenerator />} />
        <Route path="/matricule" element={<MatriculePage />} />
      </Routes>
    </Router>
  );
}

export default App
