import { Box, TextField } from '@mui/material';
import React, { useState, useEffect } from 'react';

const SearchTable = ({ value, onChange, delay = 500 }) => {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    // Set up debounced update
    const handler = setTimeout(() => {
      onChange(displayValue);
    }, delay);

    // Clean up function
    return () => {
      clearTimeout(handler);
    };
  }, [displayValue, onChange, delay]);

  return (
    <div style={{ display: 'flex', justifyContent: 'start' }}>
      <Box
        sx={{
          width: 800,
          maxWidth: '100%',
        }}>
        <TextField
          fullWidth
          label="Arama"
          id="fullWidth"
          value={displayValue}
          onChange={(e) => setDisplayValue(e.target.value)}
        />
      </Box>
    </div>
  );
};

export default SearchTable;
