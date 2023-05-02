import { AlertColor } from '@mui/material/Alert';
import { atom, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

export enum SnackbarStateKeys {
  SHOW = 'SHOW',
}

interface IToastData {
  description: string;
  isOpen?: boolean;
  severity?: AlertColor;
}

const initialState: IToastData = {
  description: '',
  isOpen: false,
  severity: 'success',
}

const snackbar = atom({
  key: SnackbarStateKeys.SHOW,
  default: initialState
});

export const useSnackBar = () => useRecoilState(snackbar);
export const useSnackBarValue = () => useRecoilValue(snackbar);
export const useSetSnackBar = () => useSetRecoilState(snackbar);
