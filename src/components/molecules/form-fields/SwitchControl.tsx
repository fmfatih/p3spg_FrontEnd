// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { Stack, Switch, SxProps, TextFieldProps, Typography } from "@mui/material"
import { Theme } from "@mui/system";
import { Control, Controller, ControllerProps } from "react-hook-form";

export type SwitchProps = {
  label: string;
} & TextFieldProps;

export interface SwitchControlProps<TFormFields>
  extends SwitchProps,
    Pick<ControllerProps, 'rules'> {
  control: Control<TFormFields, object>;
  helperText?: string;
  type?: React.HTMLInputTypeAttribute | undefined;
  id: Path<TFormFields>;
  label?: string;
  defaultValue?: any;
  isDisabled?: boolean;
  sx?: SxProps<Theme>
}

export function SwitchControl<TFormFields>(
  props: SwitchControlProps<TFormFields>,
) {
  const {
    control,
    type,
    isDisabled,
    label,
    rules,
    sx,
    defaultValue,
    ...textFieldProps
  } = props;

  return(
    <Controller
      control={control}
      name={textFieldProps.id}
      rules={rules}
      defaultValue={defaultValue}
      render={({field: {onChange, value=false}}) => {
        return (
          <Stack py={1} px={2} justifyContent="space-between" alignItems="center" flex={1} direction="row" borderRadius={1} border={`1px solid ${isDisabled ? '#ADB6C4' : '#c4c4c4'}`}>
            <Typography color={isDisabled ? '#ADB6C4' : '#41414D'} varian="body">{label}</Typography>
            <Switch disabled={isDisabled} onChange={onChange} checked={value} value={value}/>
          </Stack>
        )
      }}
    />
  )
}