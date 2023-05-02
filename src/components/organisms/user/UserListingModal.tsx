import { Box, Stack, Typography } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { useMemo } from 'react';
import { BaseModal, BaseModalProps, Table } from '../../molecules';

const initialRows = [
  { id: 1, processDate: '05.12.2023', oldValue: '36.300 TL', newValue: '32.000 TL'},
  { id: 2, processDate: '05.12.2023', oldValue: '36.300 TL', newValue: '32.000 TL'},
  { id: 3, processDate: '05.12.2023', oldValue: '36.300 TL', newValue: '32.000 TL'},
  { id: 4, processDate: '05.12.2023', oldValue: '36.300 TL', newValue: '32.000 TL'},
  { id: 5, processDate: '05.12.2023', oldValue: '36.300 TL', newValue: '32.000 TL'},
  { id: 6, processDate: '05.12.2023', oldValue: '36.300 TL', newValue: '32.000 TL'},
  { id: 7, processDate: '05.12.2023', oldValue: '36.300 TL', newValue: '32.000 TL'},
  { id: 8, processDate: '05.12.2023', oldValue: '36.300 TL', newValue: '32.000 TL'},
  { id: 9, processDate: '05.12.2023', oldValue: '36.300 TL', newValue: '32.000 TL'},
];

export type UserListingModalProps = BaseModalProps & {
  title?: string;
  userId: number;
}

export const UserListingModal = ({onClose, userId, isOpen, title="Geçmiş İşlemler"}: UserListingModalProps) => {
  const columns: GridColDef[] = useMemo(() => {
    return([
      { field: 'processDate', headerName: 'İşlem Tarihi', flex: 1 },
      { field: 'oldValue', headerName: 'Eski Değer', flex: 1 },
      { field: 'newValue', headerName: 'Yeni Değer', flex: 1 },
    ])
  }, []);

  return(
    <BaseModal onClose={onClose} title={title} isOpen={isOpen}>
      <Stack flex={1} p={2}>
        <Stack sx={{borderRadius: 2, backgroundColor: "white", py: 4, px: 5}}>
          <Stack mb={3} direction="row">
            <Box flex={1}>
              <Typography variant='h6' color="text.subtle">Adı Soyadı</Typography>
              <Typography variant='body1' color="text">Robert Fox</Typography>
            </Box>
            <Box flex={1}>
              <Typography variant='h6' color="text.subtle">Adı Soyadı</Typography>
              <Typography variant='body1' color="text">Robert Fox</Typography>
            </Box>
            <Box flex={1}>
              <Typography variant='h6' color="text.subtle">E Posta</Typography>
              <Typography variant='body1' color="text">robertfox@mail.com</Typography>
            </Box>
            <Box flex={1}>
              <Typography variant='h6' color="text.subtle">Telefon Numarası</Typography>
              <Typography variant='body1' color="text">(252) 555-0126</Typography>
            </Box>
            <Box flex={1}>
              <Typography variant='h6' color="text.subtle">Dil</Typography>
              <Typography variant='body1' color="text">Türkçe</Typography>
            </Box>
          </Stack>
          <Stack direction="row">
            <Box flex={1}>
              <Typography variant='h6' color="text.subtle">Kullanıcı Türü</Typography>
              <Typography variant='body1' color="text">Member</Typography>
            </Box>
            <Box flex={1}>
              <Typography variant='h6' color="text.subtle">Üye İş Yeri Kodu</Typography>
              <Typography variant='body1' color="text">3486712</Typography>
            </Box>
            <Box flex={1}>
              <Typography variant='h6' color="text.subtle">Oluşturma Tarihi</Typography>
              <Typography variant='body1' color="text">12.04.2014</Typography>
            </Box>
            <Box flex={1}>
              <Typography variant='h6' color="text.subtle">Güncelleme Tarihi</Typography>
              <Typography variant='body1' color="text">05.12.2023</Typography>
            </Box>
            <Box flex={1} />
          </Stack>
        </Stack>
        <Stack flex={1} mt={2} sx={{borderRadius: 2, backgroundColor: 'white'}}>
          <Table isRowSelectable={() => false} disableColumnMenu rows={initialRows} columns={columns} />
        </Stack>
      </Stack>
    </BaseModal>
  )
}
