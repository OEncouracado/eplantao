import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Para pegar o ID da URL
import { Paper, Typography, Box, TextField } from "@mui/material";

const LayoutViewer = () => {
  const { id } = useParams(); // Pegando o ID da URL
  const [template, setTemplate] = useState(null);

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const response = await fetch(
          `http://hospitalemcor.com.br/eplantao/api/templates.php?id=${id}`, // Passando o id como query string
          { method: "GET" } // Requisição GET
        );

        if (!response.ok) {
          throw new Error("Erro ao buscar template");
        }

        const templateData = await response.json();
        console.log("Template:", templateData);
        setTemplate(templateData);
      } catch (error) {
        console.error("Erro ao buscar template:", error);
      }
    };

    if (id) {
      fetchTemplate();
    }
  }, [id]); // Dependência do ID

  if (!template) {
    return <Typography variant="h6">Carregando...</Typography>;
  }

  return (
    <Paper
      style={{
        maxWidth: "100%",
        width: "210mm",
        height: "297mm",
        margin: "auto",
      }}
      sx={{
        padding: { xs: "8px", sm: "12px", md: "16px" },
        marginTop: { xs: "8px", sm: "12px", md: "16px" },
        marginBottom: { xs: "8px", sm: "12px", md: "16px" },
      }}
    >
      <Typography variant="h4">{template.name}</Typography>
      <Box style={{ marginTop: "16px" }}>
        <Typography variant="h6">Campos:</Typography>
        {Array.isArray(template.fields) && template.fields.length > 0 ? (
          <ul>
            {template.fields.map((field, index) => (
              <TextField type={field.type} label={field.label} />
            ))}
          </ul>
        ) : (
          <Typography variant="body1">Sem campos definidos</Typography>
        )}
      </Box>
    </Paper>
  );
};

export default LayoutViewer;
