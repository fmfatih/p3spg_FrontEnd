import React from 'react';
import MuiButton, {ButtonProps} from '@mui/material/Button';

export type P3Props = ButtonProps & {
  text: string;
  variant?: 'text' | 'outlined' | 'contained';
  size?: 'small' | 'medium' | 'large';
  onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined
}

export const Button = ({text, size, variant="outlined", onClick, ...props}: P3Props): JSX.Element => {
  return(
    <MuiButton size={size} onClick={onClick} variant={variant} {...props}>{text}</MuiButton>
  )
}
