// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { SxProps, TextField, TextFieldProps } from "@mui/material";
import { Theme } from "@mui/system";
import { DateTimePicker } from "@mui/x-date-pickers";
import { Control, Controller, ControllerProps } from "react-hook-form";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

export type DateTimeControlProps = {
  label: string;
} & TextFieldProps;

export interface DateTimePickerControlProps<TFormFields>
  extends DateTimeControlProps,
    Pick<ControllerProps, "rules"> {
  control: Control<TFormFields, object>;
  helperText?: string;
  maxDate?: dayjs.Dayjs;
  minDate?: dayjs.Dayjs;
  type?: React.HTMLInputTypeAttribute | undefined;
  id: Path<TFormFields>;
  label?: string;
  defaultValue?: any;
  size?: "medium" | "small";
  sx?: SxProps<Theme>;
}

export function DateTimePickerControl<TFormFields>(
  props: DateTimePickerControlProps<TFormFields>
) {
  const {
    control,
    type,
    label,
    rules,
    size = "medium",
    sx,
    defaultValue,
    maxDate,
    minDate,
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
              <DateTimePicker
                sx={sx}
                size={size}
                error={!!error}
                onChange={onChange}
                minDate={minDate}
                maxDate={maxDate}
                value={value}
                type={type}
                label={label}
                variant="outlined"
                format={"DD.MM.YYYY HH:mm"}
                ampm={false}
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
