// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import {
  InputAttributes,
  NumericFormat,
  NumericFormatProps,
} from "react-number-format";
import { Control, Controller, ControllerProps } from "react-hook-form";
import { TextField, InputAdornment } from "@mui/material";

export type NumericFormatInpControlProps = {
  label: string;
  isDisabled?: boolean;
} & NumericFormatProps<InputAttributes>;

export type FormatInputControlProps<TFormFields> = {
  control: Control<TFormFields, object>;
  isDisabled?: boolean;
  id: Path<TFormFields>;
  label?: string;
  numeric?: boolean;
  defaultValue?: any;
  size?: "medium" | "small";
  maxLength?: number;
  adornmentText?: string;
} & NumericFormatInpControlProps &
  Pick<ControllerProps, "rules">;

export function NumericFormatInputControl<TFormFields>(
  props: FormatInputControlProps<TFormFields>
) {
  const {
    control,
    type,
    label,
    rules,
    numeric,
    isDisabled,
    defaultValue,
    maxLength,
    adornmentText,
    ...textFieldProps
  } = props;

  return (
    <Controller
      control={control}
      name={textFieldProps.id}
      rules={rules}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        return (
          <NumericFormat
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">
                  {adornmentText}
                </InputAdornment>
              ),
            }}
            style={{
              height: "40px",
              borderRadius: "4px",
            }}
            disabled={isDisabled}
            value={value}
            error={!!error}
            type={type}
            customInput={TextField}
            onValueChange={(values) => {
              onChange(values.formattedValue);
            }}
            label={label}
            {...textFieldProps}
          />
        );
      }}
      defaultValue={defaultValue}
    />
  );
}
