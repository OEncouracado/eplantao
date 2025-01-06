import React, { useState, useEffect } from "react";
import {
  Paper,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  CircularProgress,
} from "@mui/material";

const Departamentos = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [newDepartment, setNewDepartment] = useState({
    name: "",
    description: "",
  });

  const handleAdd = () => {
    fetch("http://hospitalemcor.com.br/eplantao/api/departments.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newDepartment),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Erro ao adicionar o template");
        }
        return res.json();
      })
      .then((createdDepartment) => {
        setOpenAddModal(false);
        setNewDepartment({ name: "", description: "" });
        // Atualizar a lista após criar o novo Departamento
        fetch("http://hospitalemcor.com.br/eplantao/api/departments.php")
          .then((res) => res.json())
          .then((department) => setDepartments(department));
      })
      .catch((error) => {
        console.error("Erro:", error);
        alert("Ocorreu um erro ao adicionar o Departamento. Tente novamente.");
      });
  };

  const handleNewDepartmentChange = (field, value) => {
    setNewDepartment((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    fetch("http://hospitalemcor.com.br/eplantao/api/departments.php")
      .then((response) => response.json())
      .then((data) => {
        setDepartments(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Houve um erro ao buscar os departamentos!", error);
        setLoading(false);
      });
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Tem certeza que deseja excluir este departamento?")) {
      fetch("http://hospitalemcor.com.br/eplantao/api/departments.php", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Erro ao excluir o departamento");
          }
          return res.json();
        })
        .then(() => {
          fetch("http://hospitalemcor.com.br/eplantao/api/departments.php")
            .then((res) => res.json())
            .then((departments) => setDepartments(departments));
        })
        .catch((error) => {
          console.error("Erro:", error);
          alert("Ocorreu um erro ao excluir o departamento. Tente novamente.");
        });
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Paper style={{ padding: "16px" }}>
      <h2>Listagem de Departamentos</h2>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpenAddModal(true)}
        style={{ marginBottom: "16px" }}
      >
        Adicionar novo Departamento
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nome</TableCell>
              <TableCell>Descrição</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {departments.map((department) => (
              <TableRow key={department.id}>
                <TableCell>{department.id}</TableCell>
                <TableCell>{department.name}</TableCell>
                <TableCell>{department.description}</TableCell>
                <TableCell>
                  <Button variant="contained" color="primary">
                    Editar
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    style={{ marginLeft: "8px" }}
                    onClick={() => handleDelete(department.id)}
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
        <DialogTitle>Adicionar Novo Departamento</DialogTitle>
        <DialogContent
          style={{ display: "flex", flexDirection: "column", gap: "16px" }}
        >
          <TextField
            label="Nome"
            variant="outlined"
            value={newDepartment.name}
            onChange={(e) => handleNewDepartmentChange("name", e.target.value)}
          />
          <TextField
            label="Descrição"
            variant="outlined"
            value={newDepartment.description}
            onChange={(e) =>
              handleNewDepartmentChange("description", e.target.value)
            }
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

export default Departamentos;
