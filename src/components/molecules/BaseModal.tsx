import { IconButton, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import Modal from '@mui/material/Modal';
import CloseIcon from '@mui/icons-material/Close';
import { PropsWithChildren } from 'react';

export type BaseModalProps = PropsWithChildren<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
}>;

export const BaseModal = ({title, isOpen, onClose, children}: BaseModalProps) => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  return(
    <Modal sx={{flex: 1, display:'flex', justifyContent: 'center', alignItems: 'center'}} open={isOpen}>
      <Stack  sx={{overflow: 'scroll' ,borderRadius: 2, width: isDesktop ? 1024 : window.innerWidth - 40, height: isDesktop ? 700 : window.innerHeight - 75, backgroundColor: '#FFF'}}>
        <Stack direction="row" sx={{borderRadius: 2, px: 2, py: 1, backgroundColor: 'white', justifyContent: 'space-between', alignItems: 'center'}}>
          <Typography variant='h4'>{title}</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Stack>
        <Stack flex={1}>
          {children}
        </Stack>
      </Stack>
    </Modal>
  )
}
