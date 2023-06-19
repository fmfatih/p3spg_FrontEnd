import {
  IMenu,
  useAddMenu,
  useGetAllMenuList,
  useGetMenuTypeSettingsList,
  useUpdateMenu,
} from "../../../hooks";
import { Box, FormControl, Stack } from "@mui/material";
import {
  BaseModal,
  BaseModalProps,
  InputControl,
  RadioButtonsControl,
  SelectControl,
  SwitchControl,
} from "../../molecules";
import { Button, Loading } from "../../atoms";
import { useForm } from "react-hook-form";
import { useEffect, useMemo } from "react";
import { useSetSnackBar } from "../../../store/Snackbar.state";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  menuAddProfileFormSchema,
  MenuAddProfileFormSchemaFormValuesType,
  menuAddProfileInitialValues,
} from "./_formTypes";

export type MenuAddModalProps = BaseModalProps & {
  title?: string;
  menu?: IMenu;
};

export const MenuAddModal = ({
  onClose,
  menu,
  isOpen,
  title = "Yeni Menü Ekle",
}: MenuAddModalProps) => {
  const { control, reset, handleSubmit } =
    useForm<MenuAddProfileFormSchemaFormValuesType>({
      resolver: zodResolver(menuAddProfileFormSchema),
      defaultValues: menuAddProfileInitialValues,
    });
  const { mutate: updateMenu, isLoading: isUpdateLoading } = useUpdateMenu();
  const { mutate: addMenu, isLoading } = useAddMenu();
  const { data: rawMenuList } = useGetAllMenuList();
  const { data: rawMenuTypeList } = useGetMenuTypeSettingsList({});
  const setSnackbar = useSetSnackBar();

  useEffect(() => {
    if (!!menu && JSON.stringify(menu) !== "{}") {
      reset({
        name: menu.name,
        parentId: `${menu.parentId}`,
        order: `${menu.order}`,
        description: menu.description,
        url: menu.url,
        feType: menu.feType,
        menuType: `${menu.menuType}`,
        exactMatch: menu.exactMatch,
        media: menu.media,
        feId: menu.feId,
        menuCode: menu.menuCode,
      });
    }
  }, [reset, menu]);

  // const menuList = useMemo(() => {
  //   return rawMenuList?.data?.map((menu: { name: string; id: number }) => {
  //     return {
  //       label: menu.name,
  //       value: `${menu.id}`,
  //     };
  //   });
  // }, [rawMenuList?.data]);

  const menuList = useMemo(() => {
    return rawMenuList?.data?.filter((menu: { name: string; id: number, parentId: number }) => menu.parentId === 0)
      .map((menu: { name: string; id: number }) => {
        return {
          label: menu.name,
          value: `${menu.id}`,
        };
      });
  }, [rawMenuList?.data]);


  

  const menuTypeList = useMemo(() => {
    return rawMenuTypeList?.data?.map(
      (menuType: { value: string; key: string }) => {
        return {
          label: menuType.value,
          value: `${menuType.key}`,
        };
      }
    );
  }, [rawMenuTypeList?.data]);

  const onSubmit = (data: MenuAddProfileFormSchemaFormValuesType) => {
    const request = {
      ...data,
      order: Number(data.order),
      menuType: Number(data.menuType),
      parentId: Number(data.parentId),
    };

    if (menu && menu?.id > 0) {
      updateMenu(
        { ...request, id: menu.id },
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
      addMenu(request, {
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
                  sx={{ flex: 1, width: "100%" }}
                  id="name"
                  label="Menü Adı"
                  control={control}
                />
              </Box>
              <FormControl sx={{ flex: 1 }}>
                {menuList && (
                  <SelectControl
                    items={menuList}
                    sx={{ flex: 1, width: "100%" }}
                    id="parentId"
                    label="Üst Menü"
                    control={control}
                  />
                )}
              </FormControl>
            </Stack>
            <Stack alignItems="center" direction="row" spacing={2}>
              <Box flex={1}>
                <InputControl
                  numeric
                  sx={{ flex: 1, width: "100%" }}
                  id="order"
                  label="Sıra Numarası"
                  control={control}
                />
              </Box>
              <Box flex={1}>
                <InputControl
                  sx={{ flex: 1, width: "100%" }}
                  id="description"
                  label="Menü Açıklaması"
                  control={control}
                />
              </Box>
            </Stack>
            <Stack alignItems="center" direction="row" spacing={2}>
              <Box flex={1}>
                <InputControl
                  sx={{ flex: 1, width: "100%" }}
                  id="url"
                  label="Menü URL"
                  control={control}
                />
              </Box>
              <Box flex={1}>
                <InputControl
                  sx={{ flex: 1, width: "100%" }}
                  id="media"
                  label="Menü İkon Bilgisi"
                  control={control}
                />
              </Box>
            </Stack>
            <Stack alignItems="center" direction="row" spacing={2}>
              <Box flex={1}>
                <InputControl
                  sx={{ flex: 1, width: "100%" }}
                  id="feId"
                  label="Önyüz ID"
                  control={control}
                />
              </Box>
              <Box flex={1}>
                <RadioButtonsControl
                  row
                  title="Önyüz Tipi"
                  control={control}
                  id="feType"
                  items={[
                    { label: "Katlanan", value: "collapsable" },
                    { label: "Temel", value: "basic" },
                  ]}
                />
              </Box>
            </Stack>
            <Stack alignItems="center" direction="row" spacing={2}>
              <Box flex={1}>
                <SwitchControl
                  defaultValue={false}
                  label="Tam Eşlenme"
                  control={control}
                  id="exactMatch"
                />
              </Box>
              <Box flex={1}>
                {menuTypeList && (
                  <RadioButtonsControl
                    title="Menü Tipi"
                    row
                    control={control}
                    id="menuType"
                    items={menuTypeList}
                  />
                )}
              </Box>
            </Stack>
            <Stack alignItems="center" direction="row" spacing={2}>
              <Box flex={1}>
                <InputControl
                  sx={{ flex: 1, width: "100%" }}
                  id="menuCode"
                  label="Menü Kodu"
                  control={control}
                />
              </Box>
              <Box flex={1} />
            </Stack>
          </Stack>
          {/* !!! --- Button --- !!! */}
          <Stack justifyContent="flex-end" alignItems="center" direction="row">
            <Button
              variant="contained"
              text={menu ? "Güncelle" : "Ekle"}
              onClick={handleSubmit(onSubmit)}
            />
          </Stack>
        </Stack>
      </BaseModal>
    </>
  );
};
