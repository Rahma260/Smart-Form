import './App.css';
import { BrowserRouter as Router, Routes, Route, useParams } from "react-router-dom";
import SmartForm from '../src/Components/Form';
function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<SmartForm />} />
      </Routes>
    </Router>
  );
}

export default App;
