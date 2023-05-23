// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/* eslint-disable jsx-a11y/anchor-is-valid */
import {
  IUser,
  IUserAddRequest,
  useGetUserTypeList,
  useUpdateUser,
  useUserAdd,
  useGetAllMerchantList,
  useGetAllRoleList,
  useAuthorization,
} from "../../../hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  FormControl,
  Autocomplete,
  TextField,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Stack } from "@mui/system";
import { useEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button, Loading } from "../../atoms";
import {
  InputControl,
  RadioButtonsControl,
  CheckboxesControl,
  FormatInputControl,
} from "../../molecules";
import { addUserFormSchema, UserAddFormValuesType } from "../_formTypes";
import { useLocation, useNavigate } from "react-router-dom";
import { useSetSnackBar } from "../../../store/Snackbar.state";
import { useUserInfo } from "../../../store/User.state";

export const UserAddForm = () => {
  const theme = useTheme();
  const { showCreate } = useAuthorization();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const navigate = useNavigate();
  const [userInfo] = useUserInfo();
  const user = useLocation().state as unknown as IUser | undefined;
  const setSnackbar = useSetSnackBar();
  const { data: rawRoles } = useGetAllRoleList();
  const { data: rawMerchantList } = useGetAllMerchantList();
  const { data: userTypes } = useGetUserTypeList({});
  const { mutate: userAdd, isLoading: isUserAddLoading } = useUserAdd();

  const { mutate: userUpdate, isLoading: isUserUpdateLoading } =
    useUpdateUser();
  const { handleSubmit, control, reset, setValue, watch } =
    useForm<UserAddFormValuesType>({
      resolver: zodResolver(addUserFormSchema),
    });

  const [selectedMerchant, setSelectedMerchant] = useState(
    user
      ? Number(userInfo.merchantId) !== 0
        ? { label: userInfo.merchantName, value: Number(userInfo.merchantId) }
        : null
      : null
  );
  // console.log(user);
  // console.log(userInfo);
  // console.log(selectedMerchant);

  const userType = watch("userType");

  console.log(rawRoles);

  useEffect(() => {
    if (!!user && JSON.stringify(user) !== "{}") {
      const tempRoleIds = user?.roles?.reduce(
        (acc, curr) => ((acc[curr?.key] = true), acc),
        {}
      );
      setSelectedMerchant({
        label: user?.merchantName || "",
        value: user?.merchantId,
      });
      reset(
        {
          fullName: user?.fullName,
          email: user?.email,
          phoneNumber: user.phoneNumber,
          merchant: { label: user?.merchantName, value: user?.merchantId },
          // userType: `${user.userType}`,
          userType: user ? Number(user.userType) : 0,
          roleIds: tempRoleIds,
        },
        {
          keepIsValid: true,
        }
      );
    }
  }, [reset, setValue, user]);

  const merchantList = useMemo(() => {
    return rawMerchantList?.data?.map(
      (rawPosType: { merchantName: string; merchantId: number }) => {
        return {
          label: rawPosType.merchantName,
          value: rawPosType.merchantId,
        };
      }
    );
  }, [rawMerchantList?.data]);

  const roleList = useMemo(() => {
    return rawRoles?.data
      ?.filter((rawRole) => rawRole.userType === userType)
      .map((rawRole: { name: string; id: number; userType: number }) => {
        return {
          label: rawRole.name,
          value: `${rawRole.id}`,
          userType: rawRole?.userType,
        };
      });
  }, [rawRoles?.data, userType]);

  const userTypeList = useMemo(() => {
    return userTypes?.data?.map((userType: { key: string; value: string }) => {
      return {
        label: userType.key,
        value: Number(userType.value),
      };
    });
  }, [userTypes?.data]);

  const onSubmit = ({
    email,
    fullName,
    phoneNumber,
    merchant,
    roleIds,
    userType,
  }: UserAddFormValuesType) => {
    const tempRoleIds: Array<number> = [];

    for (const [key, value] of Object.entries(roleIds)) {
      if (value) {
        tempRoleIds.push(+key);
      }
    }
    const req: IUserAddRequest = {
      fullName: fullName,
      username: email,
      email: email,
      phoneNumber: phoneNumber || "",
      userType: Number(userType),
      roleIds: tempRoleIds,
      merchantId: Number(selectedMerchant?.value) || 0,
    };

    if (!!user && Number(user?.id) > 0) {
      userUpdate(
        {
          ...req,
          id: user.id,
          systemPassword: false,
          memberId: 1,
        },
        {
          onSuccess: (data) => {
            if (data.isSuccess) {
              navigate("/user-management/user-listing");
              setSnackbar({
                severity: "success",
                isOpen: true,
                description: data.message,
              });
            } else {
              setSnackbar({
                severity: "error",
                description: data.message,
                isOpen: true,
              });
            }
          },
          onError: () => {
            setSnackbar({
              severity: "error",
              description: "İşlem sırasında bir hata oluştu",
              isOpen: true,
            });
          },
        }
      );
    } else {
      userAdd(req, {
        onSuccess: (data) => {
          if (data.isSuccess) {
            navigate("/user-management/user-listing");
            setSnackbar({
              severity: "success",
              isOpen: true,
              description: data.message,
            });
          } else {
            setSnackbar({
              severity: "error",
              description: data.message,
              isOpen: true,
            });
          }
        },
        onError: () => {
          setSnackbar({
            severity: "error",
            description: "İşlem sırasında bir hata oluştu",
            isOpen: true,
          });
        },
      });
    }
  };

  const handleBack = () => navigate("/dashboard");

  return (
    <>
      {(isUserAddLoading || isUserUpdateLoading) && <Loading />}
      <Stack flex={1} justifyContent="space-between">
        <Stack flex={1} p={2}>
          <Stack spacing={isDesktop ? 4 : 2}>
            <Stack
              width={isDesktop ? 800 : "auto"}
              spacing={3}
              direction={isDesktop ? "row" : "column"}
            >
              <InputControl
                sx={{ flex: 1 }}
                label="Adı Soyadı"
                defaultValue=""
                control={control}
                id="fullName"
              />
              <InputControl
                sx={{ flex: 1 }}
                label="E Posta"
                defaultValue=""
                control={control}
                id="email"
              />
            </Stack>
            <Stack width={isDesktop ? 800 : "auto"} spacing={3} direction="row">
              <FormatInputControl
                defaultValue=""
                label="Telefon Numarası"
                control={control}
                id="phoneNumber"
                allowEmptyFormatting
                mask="_"
                format="0(###) ### ## ##"
              />
              {isDesktop && <Box sx={{ flex: 1 }} />}
            </Stack>
          </Stack>
          <Box sx={{ my: 5, borderBottom: "1px solid #E6E9ED" }} />
          <Stack spacing={3}>
            <Stack
              width={isDesktop ? 800 : "auto"}
              direction={isDesktop ? "row" : "column"}
            >
              <FormControl sx={{ width: isDesktop ? "50%" : "100%" }}>
                {merchantList && (
                  <Controller
                    control={control}
                    name="merchant"
                    render={({ field, fieldState }) => {
                      return (
                        <>
                          <Autocomplete
                            sx={{ mr: 2 }}
                            onChange={(event, selectedValue) => {
                              setSelectedMerchant(selectedValue);
                              setValue("merchant", selectedValue?.value || 0);
                              field.onChange(selectedValue?.value || 0);
                              console.log(setSelectedMerchant);
                            }}
                            id="merchant"
                            options={merchantList}
                            defaultValue={user?.id ? selectedMerchant : null}
                            getOptionLabel={(option: {
                              label: string;
                              value: number;
                            }) => option.label}
                            disabled={Number(userType) === 1}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Üye İşyeri"
                                error={fieldState.invalid}
                              />
                            )}
                          />
                        </>
                      );
                    }}
                  />
                )}
              </FormControl>
              <FormControl sx={{ width: isDesktop ? "50%" : "100%" }}>
                {userTypeList && (
                  <Controller
                    control={control}
                    name="userType"
                    render={({ field, fieldState }) => {
                      const selectedUserType = user
                        ? userTypeList.find(
                            (option) => option.value === user.userType
                          )
                        : null;

                      return (
                        <Autocomplete
                          id="userType"
                          options={userTypeList}
                          // getOptionLabel={(option: { label: string; value: number }) => option.label}
                          onChange={(event, newValue) => {
                            field.onChange(Number(newValue?.value));
                          }}
                          value={selectedUserType}
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
            <Stack width={isDesktop ? 800 : "auto"} direction="row">
              {isDesktop && <FormControl sx={{ width: "50%" }} />}
              <Box flex={1}>
                {userType ? (
                  <CheckboxesControl
                    row={!isDesktop}
                    title="Kullanıcı Rolü"
                    control={control}
                    id="roleIds"
                    items={roleList}
                  />
                ) : null}
              </Box>
            </Stack>
          </Stack>
        </Stack>
        <Stack
          borderTop="1px solid #E6E9ED"
          py={2}
          direction="row"
          justifyContent="flex-end"
        >
          {!!showCreate && (
            <Button
              onClick={handleSubmit(onSubmit)}
              variant="contained"
              text={!!user && Number(user?.id) > 0 ? "Güncelle" : "Kaydet"}
            />
          )}
          <Button onClick={handleBack} sx={{ mx: 2 }} text={"Iptal"} />
        </Stack>
      </Stack>
    </>
  );
};
