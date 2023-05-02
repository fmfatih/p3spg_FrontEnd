import React, { useState } from 'react';
import { Stack, Tab, Tabs } from '@mui/material';
import { BankListingActiveTable } from './BankListingActiveTable';
import { BankListingPassiveTable } from './BankListingPassiveTable';
import { GridRowId } from '@mui/x-data-grid';

type BankListingTableProps = {
  onRowClick?: (data: {id: GridRowId, row: any}) => void;
}

export const BankListing = ({onRowClick}: BankListingTableProps) => {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return(
    <>
    <Stack flex={1} p={2}>
      <Tabs centered value={value} onChange={handleChange}>
        <Tab label="Aktif Bankalar" />
        <Tab label="Pasif Bankalar" />
      </Tabs>
      {value === 0 && <BankListingActiveTable onRowClick={onRowClick} />}
      {value === 1 && <BankListingPassiveTable onRowClick={onRowClick} />}
    </Stack>
    </>
  )
}
