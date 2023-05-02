// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { formatPhoneNumber } from "../../../common/format";
import { SxProps, TextField, TextFieldProps } from "@mui/material"
import { Theme } from "@mui/system";
import { Control, Controller, ControllerProps } from "react-hook-form";

export type PhnControlProps = {
  label: string;
  numeric?: boolean;
} & TextFieldProps;

export interface PhoneControlProps<TFormFields>
  extends PhnControlProps,
    Pick<ControllerProps, 'rules'> {
  control: Control<TFormFields, object>;
  helperText?: string;
  type?: React.HTMLInputTypeAttribute | undefined;
  id: Path<TFormFields>;
  label?: string;
  numeric?: boolean;
  defaultValue?: any;
  size?: 'medium' | 'small';
  sx?: SxProps<Theme>
}

export function PhoneControl<TFormFields>(
  props: PhoneControlProps<TFormFields>,
) {
  const {
    control,
    type,
    label,
    rules,
    numeric,
    size="medium",
    sx,
    defaultValue,
    ...textFieldProps
  } = props;

  return(
    <Controller
      control={control}
      name={textFieldProps.id}
      rules={rules}
      render={({field: {onChange, value}, fieldState: {error}}) => {
        const formattedValue = formatPhoneNumber(value);
        const handleChange = (e: any) => {
          const text = e.target.value;
          if(text.length < 18){
            const newText = text.slice(4).split(' ').join('').split(')').join('');
            onChange(newText);
          }
        };

        return (
          <TextField sx={sx} size={size} error={!!error} onChange={handleChange} value={`0 (5${formattedValue ? formattedValue : ''}`} type={type} label={label} variant="outlined" />
        )
      }} 
      defaultValue={defaultValue}
    />
  )
}