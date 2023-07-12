import { Box, Button, FormControl, InputLabel, MenuItem, Paper, Select, TextField } from "@mui/material";
import { useState } from "react";

export  function MultipleFilter({ columns, onSubmit }: FilterFormProps) {
    const [filters, setFilters] = useState<Array<{field: string, value: string}>>([]);
  
    const handleInputChange = (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      const newFilters = [...filters];
      newFilters[index].value = value;
      setFilters(newFilters);
    };
  
    const handleFieldChange = (index: number) => (event: React.ChangeEvent<{value: unknown}>) => {
      const { value } = event.target;
      const newFilters = [...filters];
      newFilters[index].field = value as string;
      setFilters(newFilters);
    };
  
    const addFilter = () => {
      setFilters([...filters, { field: columns[0].field, value: "" }]);
    };
  
    const handleFormSubmit = (event: React.FormEvent) => {
      event.preventDefault();
      onSubmit(filters);
    };
  
    return (
      <Paper elevation={3}>
        <form onSubmit={handleFormSubmit}>
          <Box p={2} display="flex" flexDirection="column" gap={2}>
            {filters.map((filter, index) => (
              <Box key={index} display="flex" gap={2}>
                <FormControl variant="outlined" fullWidth>
                <InputLabel id="demo-simple-select-label">Kolon</InputLabel>
                  <Select
                    value={filter.field}
                    label="Kolon"
                    onChange={handleFieldChange(index)}
                  >
                    {columns.map(column => (
                      <MenuItem key={column.field} value={column.field}>{column.headerName || column.field}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  variant="outlined"
                  label="Değer"
                  value={filter.value}
                  onChange={handleInputChange(index)}
                  fullWidth
                />
              </Box>
            ))}
            <Button variant="contained" color="primary" onClick={addFilter}>Filtre Ekle</Button>
            <Button type="submit" variant="contained" color="secondary">Ara</Button>
          </Box>
        </form>
      </Paper>
    );
  }