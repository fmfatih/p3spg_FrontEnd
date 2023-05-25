import { IRole, useAddRole, useUpdateRole, useGetUserTypeList } from "../../../hooks";
import { Autocomplete, Box, FormControl, Stack, TextField, useMediaQuery,useTheme } from "@mui/material";
import { BaseModal, BaseModalProps, InputControl } from "../../molecules";
import { Button, Loading } from "../../atoms";
import { useForm,Controller } from "react-hook-form";
import { useSetSnackBar } from "../../../store/Snackbar.state";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  userRoleAddFormSchema,
  UserRoleAddFormSchemaFormValuesType,
  userRoleAddInitialValues,
} from "./_formTypes";
import { useEffect, useMemo } from "react";


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
    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const { mutate: addRole, isLoading } = useAddRole();
  const { mutate: updateRole, isLoading: isUpdateLoading } = useUpdateRole();
  const { data: userTypes } = useGetUserTypeList({});

  const setSnackbar = useSetSnackBar();

  const userTypeList = useMemo(() => {
    return userTypes?.data?.map((userType: { key: string; value: string }) => {
      return {
        label: userType.key,
        value: Number(userType.value),
      };
    });
  }, [userTypes?.data]);


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
        order: role.order,  
        userType: role.userType, 
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
              <Box flex={1}>
                <InputControl
                  size="medium"
                  type="number"
                  sx={{ flex: 1, width: "100%" }}
                  id="order"
                  label="Order"
                  control={control}
                />
              </Box>
            </Stack>
            <Stack alignItems="center" direction="row" spacing={2}>
            <FormControl sx={{ width: isDesktop ? "50%" : "100%"}}>
                {userTypeList && (
     <Controller
     control={control}
     name="userType"
     render={({ field: { onChange, value }, fieldState }) => {
       const selectedUserType = userTypeList.find(
         (option) => option.value === value
       );

       return (
         <Autocomplete
           id="userType"
           options={userTypeList}
           getOptionSelected={(option, value) =>
             option.value === value
           }
           getOptionLabel={(option) => option.label}
           value={selectedUserType || null}
           onChange={(_, newValue) => {
             onChange(newValue ? newValue.value : "");
           }}
           renderInput={(params) => (
             <TextField
               {...params}
               error={fieldState.invalid}
               label="Kullanıcı Tipi"
             />
           )}
         />
       );
     }}
   />
                )}
              </FormControl>
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
