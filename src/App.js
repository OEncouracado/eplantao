import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Listagem from "./Components/Livros";
import Templates from "./Components/Templates";

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Routes>
            <Route exact path="/" element={<Listagem />} />
            <Route exact path="/templates" element={<Templates />} />
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;
