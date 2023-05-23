// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import {
  InputAdornment,
  SxProps,
  TextField,
  TextFieldProps,
} from "@mui/material";
import { Theme } from "@mui/system";
import { Control, Controller, ControllerProps } from "react-hook-form";
import Tooltip from "@mui/material/Tooltip";
import InfoIcon from "@mui/icons-material/Info";

export type InpControlProps = {
  label: string;
  isDisabled?: boolean;
  numeric?: boolean;
  showInfoIcon?: boolean
} & TextFieldProps;

export type InputControlProps<TFormFields> = {
  control: Control<TFormFields, object>;
  helperText?: string;
  adornmentText?: string;
  isDisabled?: boolean;
  type?: React.HTMLInputTypeAttribute | undefined;
  id: Path<TFormFields>;
  label?: string;
  numeric?: boolean;
  defaultValue?: any;
  size?: "medium" | "small";
  sx?: SxProps<Theme>;
  maxLength?: number;
} & InpControlProps &
  Pick<ControllerProps, "rules">;

export function InputControl<TFormFields>(
  props: InputControlProps<TFormFields>
) {
  const {
    control,
    type,
    label,
    adornmentText,
    rules,
    tooltipText,
    numeric,
    size = "medium",
    sx,
    isDisabled,
    defaultValue,
    maxLength,
    ...textFieldProps
  } = props;

  return (
    <Controller
      control={control}
      name={textFieldProps.id}
      rules={rules}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        const handleChange = (e) => {
          if (maxLength && e.target.value.toString().length > maxLength) {
            return;
          }

          if (numeric) {
            const regex = /^[.0-9\b]+$/;
            if (e.target.value === "" || regex.test(e.target.value)) {
              onChange(e.target.value);
            } else {
              onChange(value);
            }
          } else {
            onChange(e.target.value);
          }
        };

        return (
       
          <TextField
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">
                  {adornmentText}
                  {props.showInfoIcon && ( 
                    <Tooltip title={tooltipText} placement="top">
                      <InfoIcon />
                    </Tooltip>
                  )}
                </InputAdornment>
              ),
            }}
            disabled={isDisabled}
            sx={sx}
            size={size}
            error={!!error}
            onChange={handleChange}
            value={value}
            type={type}
            label={label}
            variant="outlined"
          />
       
        );
      }}
      defaultValue={defaultValue}
    />
  );
}
