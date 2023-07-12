// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { FormControlLabel, Radio, RadioGroup, RadioGroupProps, SxProps, Theme, Typography } from "@mui/material"
import { Control, Controller, ControllerProps, Path } from "react-hook-form";

interface ILabelValue {
  label: string;
  value: string;
}

export type RadioButtonsProps = RadioGroupProps & {
  items: Array<ILabelValue>;
}

export interface RadioControlProps<TFormFields>
  extends RadioButtonsProps,
    Pick<ControllerProps, 'rules'> {
  control: Control<TFormFields, object>;
  helperText?: string;
  type?: React.HTMLInputTypeAttribute | undefined;
  id: Path<TFormFields>;
  label?: string;
  defaultValue?: any;
  sx?: SxProps<Theme>
}

export function RadioButtonsControl<TFormFields>(
  props: RadioControlProps<TFormFields>,
) {
  const {
    control,
    type,
    label,
    rules,
    sx,
    items,
    title,
    row,
    defaultValue,
    ...textFieldProps
  } = props;

  return (
    <Controller
      control={control}
      name={textFieldProps.id}
      rules={rules}
      defaultValue={defaultValue}
      render={({field: {onChange, value}, fieldState: {error}}) => {
        return (
          <>
            <Typography color={error ? 'error' : "text"} variant="overline">
              {title}
            </Typography>
            <RadioGroup
              name={textFieldProps.id}
              row={row}
              value={value}
              onChange={onChange}
              
            >
              {items.map((item) => (
                <FormControlLabel key={item.value} value={item.value} control={<Radio color={error ? 'error' : 'primary'} />}   label={<Typography color={error ? 'error' : 'initial'}>{item.label}</Typography>} />
              ))}
            </RadioGroup>
          </>
        )
      }}
    />
  )
}
