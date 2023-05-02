import { InputAdornment, TextField } from "@mui/material"
import SearchIcon from '@mui/icons-material/Search';

export interface SearchFieldProps {
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> | undefined;
  label: string;
}

export function SearchField(
  {
    onChange,
    value,
    label,
  }: SearchFieldProps,
) {
  return(
    <TextField
      size="small" 
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon style={{color: '#85858D'}} />
          </InputAdornment>
        )
    }} onChange={onChange} value={value} type="search" label={label} variant="outlined" />
  )
}