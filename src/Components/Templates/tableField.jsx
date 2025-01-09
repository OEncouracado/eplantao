import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Paper,
} from "@mui/material";

const TableField = ({ field }) => {
  const [tableData, setTableData] = React.useState(field.data);

  // Função para lidar com edições na célula
  const handleCellChange = (rowIndex, colIndex, value) => {
    const newTableData = [...tableData];
    newTableData[rowIndex][colIndex] = value;

    // Atualizar células interativas, se houver
    field.interactions?.forEach((interaction) => {
      const { sourceCell, targetCell, operation } = interaction;
      if (
        sourceCell[0] === rowIndex &&
        sourceCell[1] === colIndex &&
        operation === "sum"
      ) {
        const [targetRow, targetCol] = targetCell;
        const sourceValue = parseFloat(newTableData[rowIndex][colIndex]) || 0;
        const targetValue = parseFloat(newTableData[targetRow][targetCol]) || 0;
        newTableData[targetRow][targetCol] = sourceValue + targetValue;
      }
    });

    setTableData(newTableData);
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {Array.from({ length: field.columns }).map((_, colIndex) => (
              <TableCell key={colIndex}>Coluna {colIndex + 1}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {tableData.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {row.map((cell, colIndex) => (
                <TableCell key={colIndex}>
                  <TextField
                    fullWidth
                    value={cell}
                    onChange={(e) =>
                      handleCellChange(rowIndex, colIndex, e.target.value)
                    }
                  />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableField;
