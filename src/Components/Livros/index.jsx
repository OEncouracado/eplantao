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
  Button,
  Select,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

const Listagem = () => {
  const [data, setData] = useState([]);
  const [filterName, setFilterName] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [departments, setDepartments] = useState([]);
  const [templates, setTemplates] = useState([]);

  // Estados para o modal de edição
  const [openModal, setOpenModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null); // Item atualmente sendo editado

  // Estados para o modal de adição
  const [openAddModal, setOpenAddModal] = useState(false);
  const [newBook, setNewBook] = useState({
    name: "",
    department_id: "",
    template_id: "",
  });

  const handleAdd = () => {
    fetch("http://hospitalemcor.com.br/eplantao/api/books.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newBook),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Erro ao adicionar o livro");
        }
        return res.json();
      })
      .then((createdBook) => {
        setOpenAddModal(false);
        setNewBook({ name: "", department_id: "", template_id: "" });
        // Atualizar a lista após criar o novo livro
        fetch("http://hospitalemcor.com.br/eplantao/api/books.php")
          .then((res) => res.json())
          .then((data) => setData(data));
      })
      .catch((error) => {
        console.error("Erro:", error);
        alert("Ocorreu um erro ao adicionar o livro. Tente novamente.");
      });
  };

  const handleNewBookChange = (field, value) => {
    setNewBook((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    fetch("http://hospitalemcor.com.br/eplantao/api/books.php")
      .then((res) => res.json())
      .then((data) => setData(data));

    fetch("http://hospitalemcor.com.br/eplantao/api/departments.php")
      .then((res) => res.json())
      .then((departments) => setDepartments(departments));
    fetch("http://hospitalemcor.com.br/eplantao/api/templates.php")
      .then((res) => res.json())
      .then((templates) => setTemplates(templates));
  }, []);

  const handleSave = () => {
    // Atualize os dados no backend e localmente
    fetch(`http://hospitalemcor.com.br/eplantao/api/books.php`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(selectedItem),
    })
      .then((res) => res.json())
      .then((updatedItem) => {
        setOpenModal(false);
        setSelectedItem(null);
        // Re-fetch data from the API after saving
        fetch("http://hospitalemcor.com.br/eplantao/api/books.php")
          .then((res) => res.json())
          .then((data) => setData(data));
      });
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setOpenModal(true);
  };

  const handleChange = (field, value) => {
    setSelectedItem((prev) => ({ ...prev, [field]: value }));
  };

  const handleDelete = (id) => {
    if (window.confirm("Tem certeza que deseja excluir este item?")) {
      fetch(`http://hospitalemcor.com.br/eplantao/api/books.php?id=${id}`, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .then(() => {
          setData(data.filter((item) => item.id !== id));
        });
    }
  };

  const filteredData = data.filter((item) => {
    const matchesName = item.name
      .toLowerCase()
      .includes(filterName.toLowerCase());
    const matchesDepartment = filterDepartment
      ? item.department_id === Number(filterDepartment)
      : true;
    return matchesName && matchesDepartment;
  });

  return (
    <Paper style={{ padding: "16px" }}>
      <h2>Listagem de Livros</h2>
      <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
        <TextField
          label="Pesquisar por Nome"
          variant="outlined"
          size="small"
          value={filterName}
          onChange={(e) => setFilterName(e.target.value)}
        />
        <Select
          value={filterDepartment}
          onChange={(e) => setFilterDepartment(e.target.value)}
          displayEmpty
          size="small"
        >
          <MenuItem value="">Todos os Departamentos</MenuItem>
          {departments.map((dept) => (
            <MenuItem key={dept.id} value={dept.id}>
              {dept.name}
            </MenuItem>
          ))}
        </Select>
      </div>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpenAddModal(true)}
        style={{ marginBottom: "16px" }}
      >
        Adicionar novo Livro
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nome</TableCell>
              <TableCell>Departamento</TableCell>
              <TableCell>Template</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>
                  {departments.find((dept) => dept.id === row.department_id)
                    ?.name || "N/A"}
                </TableCell>
                <TableCell>
                  {templates.find((templ) => templ.id === row.template_id)
                    ?.name || "N/A"}
                </TableCell>

                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    style={{ marginRight: "8px" }}
                    onClick={() => handleEdit(row)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    onClick={() => handleDelete(row.id)}
                  >
                    Excluir
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal para Edição */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>Editar Livro</DialogTitle>
        <DialogContent
          style={{ display: "flex", flexDirection: "column", gap: "16px" }}
        >
          <TextField
            label="Nome"
            variant="outlined"
            value={selectedItem?.name || ""}
            onChange={(e) => handleChange("name", e.target.value)}
          />
          <Select
            value={selectedItem?.department_id || ""}
            onChange={(e) =>
              handleChange("department_id", Number(e.target.value))
            }
            displayEmpty
          >
            <MenuItem value="">Selecione o Departamento</MenuItem>
            {departments.map((dept) => (
              <MenuItem key={dept.id} value={dept.id}>
                {dept.name}
              </MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleSave} color="primary" variant="contained">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal para Adição */}
      <Dialog open={openAddModal} onClose={() => setOpenAddModal(false)}>
        <DialogTitle>Adicionar Novo Livro</DialogTitle>
        <DialogContent
          style={{ display: "flex", flexDirection: "column", gap: "16px" }}
        >
          <TextField
            label="Nome"
            variant="outlined"
            value={newBook.name}
            onChange={(e) => handleNewBookChange("name", e.target.value)}
          />
          <Select
            value={newBook.department_id}
            onChange={(e) =>
              handleNewBookChange("department_id", Number(e.target.value))
            }
            displayEmpty
          >
            <MenuItem value="">Selecione o Departamento</MenuItem>
            {departments.map((dept) => (
              <MenuItem key={dept.id} value={dept.id}>
                {dept.name}
              </MenuItem>
            ))}
          </Select>
          <Select
            value={newBook.template_id}
            onChange={(e) =>
              handleNewBookChange("template_id", Number(e.target.value))
            }
            displayEmpty
          >
            <MenuItem value="">Selecione o Template</MenuItem>
            {templates.map((template) => (
              <MenuItem key={template.id} value={template.id}>
                {template.name}
              </MenuItem>
            ))}
          </Select>
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
    </Paper>
  );
};

export default Listagem;
