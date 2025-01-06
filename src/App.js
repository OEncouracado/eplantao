import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Listagem from "./Components/Livros";
import Templates from "./Components/Templates";
import Departamentos from "./Components/Departamentos";
import EPlantaoStartPage from "./Components/Inicial";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import LayoutViewer from "./Components/Templates/layoutviewer";

function App() {
  return (
    <Router>
      <div className="App">
        {/* AppBar */}
        <AppBar position="static">
          <Toolbar>
            <Button color="inherit" href="/" sx={{ marginRight: "auto" }}>
              e-Plantão
            </Button>
            <Typography variant="h6" sx={{ flexGrow: 1, bgcolor: "black" }}>
              {/* Empty Typography to maintain spacing */}
            </Typography>
            <Button color="inherit" href="/books">
              Livros de Passagem
            </Button>
            <Button color="inherit" href="/templates">
              Templates
            </Button>
            <Button color="inherit" href="/Departments">
              Departamentos
            </Button>
          </Toolbar>
        </AppBar>
        <header className="App-header">
          <Routes>
            <Route exact path="/" element={<EPlantaoStartPage />} />
            <Route exact path="/books" element={<Listagem />} />
            <Route exact path="/templates" element={<Templates />} />
            <Route exact path="/departments" element={<Departamentos />} />
            <Route path="/layout/:id" element={<LayoutViewer />} />
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;
