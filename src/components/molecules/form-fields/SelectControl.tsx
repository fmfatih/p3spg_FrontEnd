// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import {
  InputLabel,
  MenuItem,
  Select,
  SelectProps,
  SxProps,
  Theme,
} from "@mui/material";
import { Control, ControllerProps, Path, Controller } from "react-hook-form";

interface ILabelValue {
  label: string;
  value: string;
}

type ISelectProps = SelectProps & {
  items: Array<ILabelValue>;
};

export interface SelectControlProps<TFormFields>
  extends ISelectProps,
    Pick<ControllerProps, "rules"> {
  control: Control<TFormFields, object>;
  helperText?: string;
  type?: React.HTMLInputTypeAttribute | undefined;
  id: Path<TFormFields>;
  label?: string;
  defaultValue?: any;
  sx?: SxProps<Theme>;
}

export function SelectControl<TFormFields>(
  props: SelectControlProps<TFormFields>
) {
  const {
    control,
    type,
    label,
    rules,
    sx,
    items,
    size,
    defaultValue,
    disabled = false,
    ...textFieldProps
  } = props;

  return (
    <Controller
      control={control}
      name={textFieldProps.id}
      rules={rules}
      defaultValue={defaultValue}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        return (
          <>
            <InputLabel id={`${textFieldProps.id}-label`}>{label}</InputLabel>
            <Select
              size={size}
              labelId={`${textFieldProps.id}-label`}
              id={textFieldProps.id}
              value={value}
              sx={sx}
              error={!!error}
              label={label}
              onChange={onChange}
              disabled={disabled}
            >
              {items.map((item) => (
                <MenuItem key={item.value} value={item.value}>
                  {item.label}
                </MenuItem>
              ))}
            </Select>
          </>
        );
      }}
    />
  );
}
