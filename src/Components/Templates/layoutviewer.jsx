import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  MenuItem, // eslint-disable-next-line
  Button,
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormLabel,
  Switch,
  Paper,
  TextareaAutosize,
} from "@mui/material";
import { useParams } from "react-router-dom";
import TableField from "./tableField";

const PAGE_HEIGHT_MM = 297; // Altura de uma página A4 em milímetros

const LayoutViewer = () => {
  const { id } = useParams(); // Obtém o ID da URL
  const [template, setTemplate] = useState(null);
  const [formValues, setFormValues] = useState({}); // Para gerenciar os valores do formulário
  const [pages, setPages] = useState([]); // Gerencia as páginas divididas

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const response = await fetch(
          `http://hospitalemcor.com.br/eplantao/api/templates.php?id=${id}`,
          {
            method: "GET",
          }
        );

        if (!response.ok) {
          throw new Error("Erro ao buscar o template");
        }

        const data = await response.json();
        setTemplate(data);

        const initialValues = {};
        data.fields.forEach((field) => {
          initialValues[field.name] = field.defaultValue || "";
        });
        setFormValues(initialValues);

        // Divide o layout em páginas
        paginateFields(data.fields);
      } catch (error) {
        console.error("Erro ao buscar o template:", error);
      }
    };

    fetchTemplate(); // eslint-disable-next-line
  }, [id]);

  const paginateFields = (fields) => {
    const pages = [];
    let currentPage = [];
    let currentHeight = 0;

    fields.forEach((field) => {
      const estimatedHeight = estimateFieldHeight(field);

      if (currentHeight + estimatedHeight > PAGE_HEIGHT_MM) {
        pages.push(currentPage);
        currentPage = [];
        currentHeight = 0;
      }

      currentPage.push(field);
      currentHeight += estimatedHeight;
    });

    if (currentPage.length > 0) {
      pages.push(currentPage);
    }

    setPages(pages);
    // Adiciona a última página, se houver campos restantes
    if (currentPage.length > 0) {
      pages.push(currentPage);
    }

    setPages(pages); // Atualiza o estado com as páginas
  };

  const estimateFieldHeight = (field) => {
    switch (field.type) {
      case "typography":
      case "text":
      case "email":
      case "number":
      case "date":
        return 20;
      case "select":
      case "checkbox":
      case "radio":
        return 15 + 15 * (field.options?.length || 0);
      case "switch":
      case "table":
        return 21 * (field.rows || 1); // `rows` vem do campo; usa 1 como valor padrão caso não esteja definido
      case "textbox":
        // Estima altura baseada no número de linhas de texto
        return estimateTextboxHeight(field.value);
      default:
        return 15;
    }
  };
  // Função para estimar a altura de um campo de texto
  const estimateTextboxHeight = (text) => {
    const lines = (text || "").split("\n").length;
    const averageLineHeight = 15; // Altura média por linha
    return Math.max(20, lines * averageLineHeight);
  };

  const handleChange = (name, value) => {
    setFormValues((prevValues) => {
      const updatedValues = {
        ...prevValues,
        [name]: value,
      };

      // Recalcular o layout com os novos valores
      const updatedFields = template.fields.map((field) => ({
        ...field,
        value: updatedValues[field.name] || field.defaultValue || "",
      }));

      paginateFields(updatedFields);

      return updatedValues;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Valores do formulário:", formValues);
  };

  if (!template) return <Typography>Carregando...</Typography>;

  return (
    <Box>
      {pages.map((pageFields, pageIndex) => (
        <Paper
          key={pageIndex}
          sx={{
            width: "210mm",
            height: `${PAGE_HEIGHT_MM}mm`,
            margin: "1%",
            pageBreakAfter: "always",
            overflow: "hidden",
          }}
        >
          <Box sx={{ padding: 3, maxWidth: 600, margin: "0 auto" }}>
            <Typography variant="h4" gutterBottom>
              {template.name} - Página {pageIndex + 1}
            </Typography>
            <Box component="form" onSubmit={handleSubmit}>
              {pageFields.map((field, index) => (
                <Box key={index} sx={{ marginBottom: 2 }}>
                  {field.type === "typography" && (
                    <Typography
                      variant={field.variant}
                      align={field.align}
                      color={field.color}
                    >
                      {field.value}
                    </Typography>
                  )}

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

                  {field.type === "textbox" && (
                    <TextareaAutosize
                      style={{
                        width: "100%",
                        fontSize: "0.84em",
                        fontFamily: "IBM Plex Sans, sans-serif",
                        padding: "8px 12px",
                        lineHeight: "1.5",
                        borderRadius: "6px",
                      }}
                      label={field.label}
                      placeholder={field.placeholder || ""}
                      minRows={field.rows || ""}
                      maxRows={field.rows || ""}
                      value={formValues[field.name]}
                      onChange={(e) => handleChange(field.name, e.target.value)}
                    />
                  )}

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

                  {field.type === "radio" && (
                    <Box>
                      <FormLabel>{field.label}</FormLabel>
                      <RadioGroup
                        value={formValues[field.name]}
                        onChange={(e) =>
                          handleChange(field.name, e.target.value)
                        }
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

                  {field.type === "table" && (
                    <TableField field={field} key={index} />
                  )}
                </Box>
              ))}
            </Box>
          </Box>
        </Paper>
      ))}
    </Box>
  );
};

export default LayoutViewer;
