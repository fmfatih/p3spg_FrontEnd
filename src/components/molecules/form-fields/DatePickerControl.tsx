// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { SxProps, TextField, TextFieldProps } from "@mui/material";
import { Theme } from "@mui/system";
import { DatePicker, trTR } from "@mui/x-date-pickers";
import { Control, Controller, ControllerProps } from "react-hook-form";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

export type DateControlProps = {
  label: string;
} & TextFieldProps;

export interface DatePickerControlProps<TFormFields>
  extends DateControlProps,
    Pick<ControllerProps, "rules"> {
  control: Control<TFormFields, object>;
  helperText?: string;
  type?: React.HTMLInputTypeAttribute | undefined;
  id: Path<TFormFields>;
  label?: string;
  defaultValue?: any;
  size?: "medium" | "small";
  sx?: SxProps<Theme>;
}

export function DatePickerControl<TFormFields>(
  props: DatePickerControlProps<TFormFields>
) {
  const {
    control,
    type,
    label,
    rules,
    size = "medium",
    sx,
    defaultValue,
    ...textFieldProps
  } = props;

  return (
    <Controller
      control={control}
      name={textFieldProps.id}
      rules={rules}
      render={({ field: { onChange, name, value }, fieldState: { error } }) => {
        return (
          <>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                sx={sx}
                size={size}
                error={!!error}
                onChange={onChange}
                value={value}
                type={type}
                label={label}
                variant="outlined"
                format={"DD.MM.YYYY"}
                renderInput={(params) => <TextField {...params} id={name} />}
              />
            </LocalizationProvider>
          </>
        );
      }}
      defaultValue={defaultValue}
    />
  );
}
