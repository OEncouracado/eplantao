import React from "react";
import {
  // eslint-disable-next-line
  AppBar,
  // eslint-disable-next-line
  Toolbar,
  Typography,
  // eslint-disable-next-line
  Button,
  Grid,
  Card,
  CardContent,
  // eslint-disable-next-line
  Table,
  // eslint-disable-next-line
  TableBody,
  // eslint-disable-next-line
  TableCell,
  // eslint-disable-next-line
  TableHead,
  // eslint-disable-next-line
  TableRow,
  Container,
} from "@mui/material";
import Listagem from "../Livros";

const EPlantaoStartPage = () => {
  return (
    <div>
      {/* Main Content */}
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Grid container spacing={4}>
          {/* Resumo do Sistema */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Resumo Geral
                </Typography>
                <Typography>Total de Livros de Passagem: 15</Typography>
                <Typography>
                  Total de Transferências Registradas: 120
                </Typography>
                <Typography>Relatórios de Enfermagem Submetidos: 45</Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Últimos Registros */}
          <Grid item xs={12} md={8}>
            <Listagem />
          </Grid>
        </Grid>
      </Container>

      {/* Footer */}
      <footer
        style={{
          marginTop: "20px",
          padding: "10px",
          textAlign: "center",
          background: "#f5f5f5",
        }}
      >
        <Typography variant="body2" color="textSecondary">
          &copy; 2025 e-Plantão. Criado por{" "}
          <a
            href="http://mavsleo.com.br"
            target="_blank"
            rel="noopener noreferrer"
          >
            Mavs Leo &copy;
          </a>{" "}
          Todos os direitos reservados.
        </Typography>
      </footer>
    </div>
  );
};

export default EPlantaoStartPage;
