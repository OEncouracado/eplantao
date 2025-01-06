import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import { Link } from "react-router-dom"; // Usaremos o Link do react-router-dom

const Templates = () => {
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    fetch("http://hospitalemcor.com.br/eplantao/api/templates.php")
      .then((res) => res.json())
      .then((templates) => setTemplates(templates));
  }, []);

  return (
    <Paper style={{ padding: "16px" }}>
      <h2>Listagem de Templates</h2>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nome</TableCell>
              <TableCell>Campos</TableCell>
              <TableCell>Layout</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {templates.map((template) => (
              <TableRow key={template.id}>
                <TableCell>{template.id}</TableCell>
                <TableCell>{template.name}</TableCell>
                <TableCell>{template.fields?.length || 0}</TableCell>
                <TableCell>
                  <Link to={`/layout/${template.id}`}>
                    <Button variant="contained" color="primary">
                      Visualizar Layout
                    </Button>
                  </Link>
                </TableCell>
                <TableCell>
                  <Button variant="contained" color="primary">
                    Editar
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    style={{ marginLeft: "8px" }}
                  >
                    Excluir
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default Templates;
