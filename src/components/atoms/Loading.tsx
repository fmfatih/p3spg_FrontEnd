import { CircularProgress, Stack } from '@mui/material';
import Modal from '@mui/material/Modal';

export const Loading = () => {
  return (
    <Modal open>
      <Stack flex={1} sx={{justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100vw', backgroundColor: "rgba(0, 0, 0, 0.2)"}}>
        <CircularProgress />
      </Stack>
    </Modal>
  )
}