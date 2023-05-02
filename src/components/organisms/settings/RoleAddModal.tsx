import { IRole, useAddRole, useUpdateRole } from "../../../hooks";
import { Box, Stack } from "@mui/material";
import { BaseModal, BaseModalProps, InputControl } from "../../molecules";
import { Button, Loading } from "../../atoms";
import { useForm } from "react-hook-form";
import { useSetSnackBar } from "../../../store/Snackbar.state";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  userRoleAddFormSchema,
  UserRoleAddFormSchemaFormValuesType,
  userRoleAddInitialValues,
} from "./_formTypes";
import { useEffect } from "react";

export type RoleAddModalProps = BaseModalProps & {
  title?: string;
  role?: IRole;
};

export const RoleAddModal = ({
  onClose,
  role,
  isOpen,
  title = "Mesaj Ekle",
}: RoleAddModalProps) => {
  const { control, reset, handleSubmit } =
    useForm<UserRoleAddFormSchemaFormValuesType>({
      resolver: zodResolver(userRoleAddFormSchema),
      defaultValues: userRoleAddInitialValues,
    });
  const { mutate: addRole, isLoading } = useAddRole();
  const { mutate: updateRole, isLoading: isUpdateLoading } = useUpdateRole();

  const setSnackbar = useSetSnackBar();

  const onSubmit = (data: any) => {
    if (role && role?.id > 0) {
      updateRole(
        { ...data, id: role.id },
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
      addRole(data, {
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
    if (!!role && JSON.stringify(role) !== "{}") {
      reset({
        name: role.name,
        code: role.code,
        description: role.description,
      });
    }
  }, [reset, role]);

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
                  id="name"
                  label="Rol Adı"
                  control={control}
                />
              </Box>
              <Box flex={1}>
                <InputControl
                  size="medium"
                  sx={{ flex: 1, width: "100%" }}
                  id="code"
                  label="Rol Kodu"
                  control={control}
                />
              </Box>
            </Stack>
            <Stack alignItems="center" direction="row" spacing={2}>
              <Box flex={1}>
                <InputControl
                  size="medium"
                  sx={{ flex: 1, width: "100%" }}
                  id="description"
                  label="Açıklama"
                  control={control}
                />
              </Box>
            </Stack>
          </Stack>
          {/* !!! --- Button --- !!! */}
          <Stack justifyContent="flex-end" alignItems="center" direction="row">
            <Button
              variant="contained"
              text={role ? "Güncelle" : "Ekle"}
              onClick={handleSubmit(onSubmit)}
            />
          </Stack>
        </Stack>
      </BaseModal>
    </>
  );
};
