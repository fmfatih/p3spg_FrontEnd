import React, { useState } from 'react';
import { Stack, Tab, Tabs } from '@mui/material';
import {BusinessBankListingActiveTable } from './BusinessBankListingActiveTable';
import { BusinessBankListingPassiveTable } from './BusinessBankListingPassiveTable';
import { GridRowId } from '@mui/x-data-grid';


type BusinessBankListingProps = {
  onRowClick?: (data: {id: GridRowId, row: any}) => void;
}

export const BusinessBankList = ({onRowClick}: BusinessBankListingProps) => {
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
      {value === 0 && <BusinessBankListingActiveTable onRowClick={onRowClick} />}
      {value === 1 && <BusinessBankListingPassiveTable onRowClick={onRowClick} />}
    </Stack>
    </>
  )
}
