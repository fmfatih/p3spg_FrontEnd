import {
  IParameter,
  useAddParameter,
  useUpdateParameter,
} from "../../../hooks";
import { Box, Stack } from "@mui/material";
import { BaseModal, BaseModalProps, InputControl } from "../../molecules";
import { Button, Loading } from "../../atoms";
import { useForm } from "react-hook-form";
import { useSetSnackBar } from "../../../store/Snackbar.state";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  parameterAddFormSchema,
  ParameterAddFormSchemaFormValuesType,
  parameterAddInitialValues,
} from "./_formTypes";
import { useEffect } from "react";

export type ParameterAddModalProps = BaseModalProps & {
  title?: string;
  parameter?: IParameter;
};

export const ParameterAddModal = ({
  onClose,
  parameter,
  isOpen,
  title = "Parametre Ekle",
}: ParameterAddModalProps) => {
  const { control, reset, handleSubmit } =
    useForm<ParameterAddFormSchemaFormValuesType>({
      resolver: zodResolver(parameterAddFormSchema),
      defaultValues: parameterAddInitialValues,
    });
  const { mutate: addParameter, isLoading } = useAddParameter();
  const { mutate: updateParameter, isLoading: isUpdateLoading } =
    useUpdateParameter();

  const setSnackbar = useSetSnackBar();

  const onSubmit = (data: any) => {
    if (parameter && parameter?.id > 0) {
      updateParameter(
        { ...data, id: parameter.id },
        {
          onSuccess(data) {
            if (data.isSuccess) {
              onClose();
              setSnackbar({
                severity: "success",
                isOpen: true,
                description: data.message,
              });
            } else {
              setSnackbar({
                severity: "error",
                isOpen: true,
                description: data.message,
              });
            }
          },
          onError: () => {
            setSnackbar({
              severity: "error",
              isOpen: true,
              description: "İşlem sırasında bir hata oluştu",
            });
          },
        }
      );
    } else {
      addParameter(data, {
        onSuccess(data) {
          if (data.isSuccess) {
            onClose();
            setSnackbar({
              severity: "success",
              isOpen: true,
              description: data.message,
            });
          } else {
            setSnackbar({
              severity: "error",
              isOpen: true,
              description: data.message,
            });
          }
        },
        onError: () => {
          setSnackbar({
            severity: "error",
            isOpen: true,
            description: "İşlem sırasında bir hata oluştu",
          });
        },
      });
    }
  };

  useEffect(() => {
    if (!!parameter && JSON.stringify(parameter) !== "{}") {
      reset({
        groupCode: parameter.groupCode,
        key: parameter.key,
        value: parameter.value,
      });
    }
  }, [reset, parameter]);

  useEffect(() => {
    if (isOpen === false) {
      reset({});
    }
  }, [isOpen]);

  return (
    <>
      {(isLoading || isUpdateLoading) && <Loading />}
      <BaseModal onClose={onClose} title={title} isOpen={isOpen}>
        <Stack flex={1} p={4}>
          {/* !!! --- FORM --- !!! */}
          <Stack spacing={2} flex={1}>
            <Stack alignItems="center" direction="row" spacing={2}>
              <Box flex={1}>
                <InputControl
                  size="medium"
                  sx={{ flex: 1, width: "100%" }}
                  id="groupCode"
                  label="Grup Kodu"
                  control={control}
                />
              </Box>
              <Box flex={1}>
                <InputControl
                  size="medium"
                  sx={{ flex: 1, width: "100%" }}
                  id="key"
                  label="Anahtar"
                  control={control}
                />
              </Box>
            </Stack>
            <Stack alignItems="center" direction="row" spacing={2}>
              <Box flex={1}>
                <InputControl
                  size="medium"
                  sx={{ flex: 1, width: "100%" }}
                  id="value"
                  label="Değer"
                  control={control}
                />
              </Box>
            </Stack>
          </Stack>
          {/* !!! --- Button --- !!! */}
          <Stack justifyContent="flex-end" alignItems="center" direction="row">
            <Button
              variant="contained"
              text={parameter ? "Güncelle" : "Ekle"}
              onClick={handleSubmit(onSubmit)}
            />
          </Stack>
        </Stack>
      </BaseModal>
    </>
  );
};
