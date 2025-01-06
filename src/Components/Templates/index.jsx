import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button, // eslint-disable-next-line
  Select, // eslint-disable-next-line
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";

const Templates = () => {
  const [templates, setTemplates] = useState([]);

  const [openAddModal, setOpenAddModal] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    name: "",
  });

  const handleNewTemplateChange = (field, value) => {
    setNewTemplate((prev) => ({ ...prev, [field]: value }));
  };

  const handleAdd = () => {
    fetch("http://hospitalemcor.com.br/eplantao/api/templates.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTemplate),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Erro ao adicionar o template");
        }
        return res.json();
      })
      .then((createdTemplate) => {
        setOpenAddModal(false);
        setNewTemplate({ name: "", fields: "" });
        // Atualizar a lista após criar o novo template
        fetch("http://hospitalemcor.com.br/eplantao/api/templates.php")
          .then((res) => res.json())
          .then((templates) => setTemplates(templates));
      })
      .catch((error) => {
        console.error("Erro:", error);
        alert("Ocorreu um erro ao adicionar o template. Tente novamente.");
      });
  };

  useEffect(() => {
    fetch("http://hospitalemcor.com.br/eplantao/api/templates.php")
      .then((res) => res.json())
      .then((templates) => setTemplates(templates));
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Tem certeza que deseja excluir este item?")) {
      fetch(`http://hospitalemcor.com.br/eplantao/api/templates.php?id=${id}`, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .then(() => {
          setTemplates(templates.filter((item) => item.id !== id));
        });
    }
  };

  return (
    <Paper style={{ padding: "16px" }}>
      <h2>Listagem de Templates</h2>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpenAddModal(true)}
        style={{ marginBottom: "16px" }}
      >
        Adicionar novo Template
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nome</TableCell>
              <TableCell>Campos</TableCell>
              <TableCell>Layout</TableCell>
              <TableCell>Categoria</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {templates.map((template) => (
              <TableRow key={template.id}>
                <TableCell>{template.id}</TableCell>
                <TableCell>{template.name}</TableCell>
                <TableCell>
  <Accordion>
    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
      <span>{`Campos (${template.fields?.length || 0})`}</span>
    </AccordionSummary>
    <AccordionDetails>
      {Array.isArray(template.fields) ? (
        <ul>
          {template.fields.map((field, index) => (
            <li key={index}>
              <strong>Tipo:</strong> {field.type}, <strong>Rótulo:</strong> {field.label}
            </li>
          ))}
        </ul>
      ) : (
        <span>Sem campos definidos</span>
      )}
    </AccordionDetails>
  </Accordion>
</TableCell>
                <TableCell>{template.layout}</TableCell>
                <TableCell>{template.category}</TableCell>
                <TableCell>
                  <Button variant="contained" color="primary">
                    Editar
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    style={{ marginLeft: "8px" }}
                    onClick={() => handleDelete(template.id)}
                  >
                    Excluir
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal para Adição */}
      <Dialog open={openAddModal} onClose={() => setOpenAddModal(false)}>
        <DialogTitle>Adicionar Novo Template</DialogTitle>
        <DialogContent
          style={{ display: "flex", flexDirection: "column", gap: "16px" }}
        >
          <TextField
            label="Nome"
            variant="outlined"
            value={newTemplate.name}
            onChange={(e) => handleNewTemplateChange("name", e.target.value)}
          />
          <TextField
            label="Campos"
            variant="outlined"
            value={newTemplate.fields}
            onChange={(e) => handleNewTemplateChange("fields", e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddModal(false)} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleAdd} color="primary" variant="contained">
            Adicionar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal para Edição */}
    </Paper>
  );
};

export default Templates;
