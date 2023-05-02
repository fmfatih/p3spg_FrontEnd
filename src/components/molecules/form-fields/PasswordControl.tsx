// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import {
  InputAdornment,
  SxProps,
  TextField,
  TextFieldProps,
} from "@mui/material";
import { Theme } from "@mui/system";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Control, Controller, ControllerProps } from "react-hook-form";
import { useState } from "react";

export type PassControlProps = {
  label: string;
  isDisabled?: boolean;
  numeric?: boolean;
} & TextFieldProps;

export type PasswordControlProps<TFormFields> = {
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

export function PasswordControl<TFormFields>(
  props: PasswordControlProps<TFormFields>
) {
  const {
    control,
    type,
    label,
    adornmentText,
    rules,
    numeric,
    size = "medium",
    sx,
    isDisabled,
    defaultValue,
    maxLength,
    ...textFieldProps
  } = props;

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

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
            type={showPassword ? "text" : "password"}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            disabled={isDisabled}
            sx={sx}
            size={size}
            error={!!error}
            onChange={handleChange}
            value={value}
            label={label}
            variant="outlined"
          />
        );
      }}
      defaultValue={defaultValue}
    />
  );
}
