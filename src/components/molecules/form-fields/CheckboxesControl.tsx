// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { Typography, FormControlLabel, Checkbox, CheckboxProps, SxProps, Theme, FormGroup } from "@mui/material"
import { Control, Controller, ControllerProps, Path } from "react-hook-form";

interface ILabelValue {
  label: string;
  value: string;
}

export type CheckboxesProps = CheckboxProps & {
  items: Array<ILabelValue>;
}

export interface CheckboxesControlProps<TFormFields>
  extends CheckboxesProps,
    Pick<ControllerProps, 'rules'> {
  control: Control<TFormFields, object>;
  helperText?: string;
  type?: React.HTMLInputTypeAttribute | undefined;
  id: Path<TFormFields>;
  label?: string;
  defaultValue?: any;
  row?: boolean;
  sx?: SxProps<Theme>
  itemsSx?: SxProps<Theme>;
}

export function CheckboxesControl<TFormFields>(
  props: CheckboxesControlProps<TFormFields>,
) {
  const {
    control,
    type,
    label,
    rules,
    sx,
    itemsSx,
    row,
    title,
    items,
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
            <FormGroup sx={sx} row={row}>
              {items?.map((item) => (
                <FormControlLabel
                  key={item.value}
                  value={item.value}
                  sx={itemsSx}
                  control={<Checkbox  
                    checked={(item.value && value) ? value[item.value] : false}
                    onChange={(event) => {
                    const tempValue = {};
                    tempValue[item.value] = event.target.checked;
                    onChange({...value, ...tempValue});
                  }} name={item.value} />}
                  label={item.label}
                />
              ))}
            </FormGroup>
          </>
        )
      }}
    />
  )
}
