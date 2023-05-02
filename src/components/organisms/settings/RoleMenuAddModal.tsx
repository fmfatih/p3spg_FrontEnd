/* eslint-disable array-callback-return */
import { useEffect } from "react";
import {
  IRoleMenu,
  useAddRoleMenu,
  useGetAllMenuList,
  useGetAllRoleList,
  useUpdateRoleMenu,
} from "../../../hooks";
import {
  Autocomplete,
  Box,
  Checkbox,
  FormControl,
  Stack,
  Typography,
  TextField,
} from "@mui/material";
import {
  BaseModal,
  BaseModalProps,
  SelectControl,
  SwitchControl,
} from "../../molecules";
import { Button } from "../../atoms";
import { useForm, Controller } from "react-hook-form";
import { useMemo, useState } from "react";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { useSetSnackBar } from "../../../store/Snackbar.state";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  roleMenuAddFormSchema,
  RoleMenuAddFormSchemaFormValuesType,
  roleMenuAddInitialValues,
} from "./_formTypes";

export type RoleMenuAddModalProps = BaseModalProps & {
  title?: string;
  roleMenu?: any;
};

export const RoleMenuAddModal = ({
  onClose,
  isOpen,
  roleMenu,
  title = "Role Menü Ekle",
}: RoleMenuAddModalProps) => {
  const { control, reset, handleSubmit } =
    useForm<RoleMenuAddFormSchemaFormValuesType>({
      resolver: zodResolver(roleMenuAddFormSchema),
      defaultValues: roleMenuAddInitialValues,
    });
  const [selectedMenuIds, setSelectedMenuIds] = useState([] as any);
  const [selectedMenuIdsObject, setSelectedMenuIdsObject] = useState([] as any);

  const { data: rawMenuList } = useGetAllMenuList();
  const { data: rawRoleList } = useGetAllRoleList();
  const { mutate: addRoleMenu } = useAddRoleMenu();
  const { mutate: updateRoleMenu } = useUpdateRoleMenu();
  const setSnackbar = useSetSnackBar();

  useEffect(() => {
    if (!!roleMenu && JSON.stringify(roleMenu) !== "{}") {
      reset({
        roleId: roleMenu.roleId,
        //menuIds: roleMenu.menuIds,
        read: roleMenu?.read,
        update: roleMenu?.update,
        create: roleMenu?.create,
        delete: roleMenu?.delete,
      });
      setSelectedMenuIds([
        { label: roleMenu?.menuName, value: roleMenu?.menuId },
      ]);
      setSelectedMenuIdsObject([
        { label: roleMenu?.menuName, value: `${roleMenu?.menuId}` },
      ]);
    }
  }, [reset, roleMenu]);

  const roleList = useMemo(() => {
    return rawRoleList?.data?.map((menu: { name: string; id: number }) => {
      return {
        label: menu.name,
        value: `${menu.id}`,
      };
    });
  }, [rawRoleList?.data]);

  const menuList = useMemo(() => {
    return rawMenuList?.data?.map((menu: { name: string; id: number }) => {
      return {
        label: menu.name,
        value: `${menu.id}`,
      };
    });
  }, [rawMenuList?.data]);

  const onSubmit = (data: RoleMenuAddFormSchemaFormValuesType) => {
    const request = {
      ...data,
      roleId: Number(data.roleId),
      menuIds: selectedMenuIds,
    };

    if (roleMenu && roleMenu?.id > 0) {
      updateRoleMenu(
        { ...data, id: roleMenu.id, menuId: selectedMenuIds[0]?.value || 0 },
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
      addRoleMenu(request, {
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

  const handleMenuListChange = (event: any, selectedValues: any) => {
    setSelectedMenuIds([]);

    let list: Array<number> = [];

    selectedValues.map((e: { label: string; value: number }) => {
      list.push(e.value);
    });

    setSelectedMenuIds(list);
  };

  useEffect(() => {
    if (isOpen === false) {
      reset({});
    }
  }, [isOpen]);

  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;

  return (
    <BaseModal onClose={onClose} title={title} isOpen={isOpen}>
      <Stack flex={1} p={4}>
        {/* !!! --- FORM --- !!! */}
        <Stack spacing={2} flex={1}>
          <Stack alignItems="center" direction="row" spacing={2}>
            <FormControl sx={{ flex: 1 }}>
              {roleList && (
                <SelectControl
                  items={roleList}
                  size="medium"
                  sx={{ flex: 1, width: "100%" }}
                  id="roleId"
                  label="Rol"
                  control={control}
                />
              )}
            </FormControl>
            <Box flex={1}>
              <SwitchControl
                defaultValue={false}
                label="Okuma Yetkisi"
                control={control}
                id="read"
              />
            </Box>
          </Stack>
          <Stack alignItems="center" direction="row" spacing={2}>
            <Box flex={1}>
              <SwitchControl
                defaultValue={false}
                label="Güncelleme Yetkisi"
                control={control}
                id="update"
              />
            </Box>
            <Box flex={1}>
              <SwitchControl
                defaultValue={false}
                label="Yazma Yetkisi"
                control={control}
                id="create"
              />
            </Box>
          </Stack>
          <Stack alignItems="center" direction="row" spacing={2}>
            <Box flex={1}>
              <SwitchControl
                defaultValue={false}
                label="Silme Yetkisi"
                control={control}
                id="delete"
              />
            </Box>
            <Box flex={1}></Box>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography>Menü Seçimi</Typography>
          </Stack>
          <Stack alignItems="center" direction="row">
            <FormControl sx={{ flex: 1 }}>
              {menuList && (
                <Controller
                  control={control}
                  name="menuIds"
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => {
                    return (
                      <Autocomplete
                        multiple
                        id="menuIds"
                        onChange={(event, selectedValue) => {
                          setSelectedMenuIdsObject(selectedValue);
                          handleMenuListChange(event, selectedValue);
                        }}
                        value={selectedMenuIdsObject}
                        options={menuList}
                        disableCloseOnSelect
                        getOptionLabel={(option: {
                          label: string;
                          value: string;
                        }) => option.label}
                        renderOption={(props, option, { selected }) => (
                          <li {...props}>
                            <Checkbox
                              icon={icon}
                              checkedIcon={checkedIcon}
                              style={{ marginRight: 8 }}
                              checked={selected}
                              value={option.value}
                            />
                            {option.label}
                          </li>
                        )}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Menü Listesi"
                            placeholder=""
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
            text={roleMenu ? "Güncelle" : "Ekle"}
            onClick={handleSubmit(onSubmit)}
          />
        </Stack>
      </Stack>
    </BaseModal>
  );
};
