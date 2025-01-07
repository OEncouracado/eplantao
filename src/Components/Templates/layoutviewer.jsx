import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormLabel,
  Switch,
  Paper,
} from "@mui/material";
import { useParams } from "react-router-dom";

const LayoutViewer = () => {
  const { id } = useParams(); // Obtém o ID da URL
  const [template, setTemplate] = useState(null);
  const [formValues, setFormValues] = useState({}); // Para gerenciar os valores do formulário

  // Recupera o layout do backend
  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const response = await fetch(
          `http://hospitalemcor.com.br/eplantao/api/templates.php?id=${id}`, // Passa o ID via query string
          {
            method: "GET",
          }
        );

        if (!response.ok) {
          throw new Error("Erro ao buscar o template");
        }

        const data = await response.json();
        setTemplate(data);

        // Inicializa os valores do formulário
        const initialValues = {};
        data.fields.forEach((field) => {
          initialValues[field.name] = field.defaultValue || "";
        });
        setFormValues(initialValues);
      } catch (error) {
        console.error("Erro ao buscar o template:", error);
      }
    };

    fetchTemplate();
  }, [id]);

  const handleChange = (name, value) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Valores do formulário:", formValues);
  };

  if (!template) return <Typography>Carregando...</Typography>;

  return (
    <Paper sx={{ width: "210mm", height: "297mm", margin: "1%" }}>
      <Box sx={{ padding: 3, maxWidth: 600, margin: "0 auto" }}>
        <Typography variant="h4" gutterBottom>
          {template.name}
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          {template.fields.map((field, index) => (
            <Box key={index} sx={{ marginBottom: 2 }}>
              {/* Tipo de Campo: Texto */}

              {field.type === "typography" && <Typography />}
              {field.type === "text" && (
                <TextField
                  fullWidth
                  label={field.label}
                  placeholder={field.placeholder || ""}
                  variant="outlined"
                  value={formValues[field.name]}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                />
              )}

              {/* Tipo de Campo: E-MAIL */}
              {field.type === "email" && (
                <TextField
                  fullWidth
                  type="email"
                  label={field.label}
                  placeholder={field.placeholder || ""}
                  variant="outlined"
                  value={formValues[field.name]}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                />
              )}

              {/* Tipo de Campo: Número */}
              {field.type === "number" && (
                <TextField
                  fullWidth
                  type="number"
                  label={field.label}
                  placeholder={field.placeholder || ""}
                  variant="outlined"
                  value={formValues[field.name]}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                />
              )}

              {/* Tipo de Campo: Data */}
              {field.type === "date" && (
                <TextField
                  fullWidth
                  type="date"
                  label={field.label}
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                  value={formValues[field.name]}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                />
              )}

              {/* Tipo de Campo: Seleção (Dropdown) */}
              {field.type === "select" && (
                <TextField
                  fullWidth
                  select
                  label={field.label}
                  variant="outlined"
                  value={formValues[field.name]}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                >
                  {field.options.map((option, idx) => (
                    <MenuItem key={idx} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              )}

              {/* Tipo de Campo: Checkbox */}
              {field.type === "checkbox" && (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={!!formValues[field.name]}
                      onChange={(e) =>
                        handleChange(field.name, e.target.checked)
                      }
                    />
                  }
                  label={field.label}
                />
              )}

              {/* Tipo de Campo: Radio */}
              {field.type === "radio" && (
                <Box>
                  <FormLabel>{field.label}</FormLabel>
                  <RadioGroup
                    value={formValues[field.name]}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                  >
                    {field.options.map((option, idx) => (
                      <FormControlLabel
                        key={idx}
                        value={option.value}
                        control={<Radio />}
                        label={option.label}
                      />
                    ))}
                  </RadioGroup>
                </Box>
              )}

              {/* Tipo de Campo: Switch */}
              {field.type === "switch" && (
                <FormControlLabel
                  control={
                    <Switch
                      checked={!!formValues[field.name]}
                      onChange={(e) =>
                        handleChange(field.name, e.target.checked)
                      }
                    />
                  }
                  label={field.label}
                />
              )}
            </Box>
          ))}
        </Box>
      </Box>
    </Paper>
  );
};

export default LayoutViewer;
