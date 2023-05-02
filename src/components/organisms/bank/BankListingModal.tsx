import { Stack } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { useMemo } from 'react';
import { BaseModal, BaseModalProps, Table } from '../../molecules';

const initialRows = [
  { id: 1, processDate: '05.12.2023', process: 'Islem silme', updateUser: 'Fatih Mert', oldValue: '36.300 TL', newValue: '32.000 TL'},
  { id: 2, processDate: '06.12.2023', process: 'Para transfer', updateUser: 'Fatih Mert', oldValue: '36.300 TL', newValue: '32.000 TL'},
  { id: 3, processDate: '07.12.2023', process: 'Para', updateUser: 'Fatih Mert', oldValue: '36.300 TL', newValue: '32.000 TL'},
  { id: 4, processDate: '08.12.2023', process: 'Para transfer', updateUser: 'Fatih Mert', oldValue: '36.300 TL', newValue: '32.000 TL'},
];

export type BankListingModalProps = BaseModalProps & {
  title?: string;
  userId: number;
}

export const BankListingModal = ({onClose, userId, isOpen, title="Detaylar"}: BankListingModalProps) => {
  const columns: GridColDef[] = useMemo(() => {
    return([
      { field: 'processDate', headerName: 'İşlem Tarihi', flex: 1 },
      { field: 'process', headerName: 'İşlem', flex: 1 },
      { field: 'oldValue', headerName: 'Eski Değer', flex: 1 },
      { field: 'newValue', headerName: 'Yeni Değer', flex: 1 },
      { field: 'updateUser', headerName: 'Güncelleye', flex: 1 },
    ])
  }, []);

  return(
    <BaseModal onClose={onClose} title={title} isOpen={isOpen}>
      <Stack flex={1} p={2}>
        <Table isRowSelectable={() => false} disableColumnMenu rows={initialRows} columns={columns} />
      </Stack>
    </BaseModal>
  )
}
