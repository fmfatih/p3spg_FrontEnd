// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/* eslint-disable jsx-a11y/anchor-is-valid */
// import * as React from "react";
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
  SwitchControl,
} from "../../molecules";
import { addUserFormSchema, UserAddFormValuesType } from "../_formTypes";
import { useLocation, useNavigate } from "react-router-dom";
import { useSetSnackBar } from "../../../store/Snackbar.state";
import { useUserInfo } from "../../../store/User.state";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";

import FormLabel from "@mui/material/FormLabel";

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
  const { handleSubmit, control, reset, setValue, watch,getValues } =
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
  const [userStatus, setUserStatus] = useState("");

  const userType = watch("userType");
  const fullName = watch("fullName");

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
      setUserStatus(user.status);
      reset(
        {
          fullName: user?.fullName,
          email: user?.email,
          phoneNumber: user.phoneNumber,
          merchant: { label: user?.merchantName, value: user?.merchantId },
          // userType: `${user.userType}`,
          userType: user ? Number(user.userType) : 0,
          roleIds: tempRoleIds,
          status: user.status,
        },
        {
          keepIsValid: true,
        }
      );
    }
  }, [reset, setValue, user]);

  // console.log(userTypeList);
  // const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setStatus((event.target as HTMLInputElement).value);
  // };

  // console.log(userInfo.merchantName);

  //   const merchantList = useMemo(() => {
  //     return rawMerchantList?.data?.map(
  //       (rawPosType: { merchantName: string; merchantId: number }) => {
  //         return {
  //           label: rawPosType.merchantName,
  //           value: rawPosType.merchantId,
  //         };
  //       }
  //     );
  //   }, [rawMerchantList?.data]);


  const merchantList = useMemo(() => {
 
    if (userInfo.merchantId == 0) {
        return rawMerchantList?.data?.map(
            (rawPosType: { merchantName: string; merchantId: number }) => {
                return {
                    label: rawPosType.merchantName,
                    value: rawPosType.merchantId,
                };
            }
        );
    } else {
        return rawMerchantList?.data
            ?.filter((rawPosType: { merchantName: string; merchantId: number }) => {
                return rawPosType.merchantId === Number(userInfo.merchantId);
            })
            .map((filteredMerchant) => {
                return {
                    label: filteredMerchant.merchantName,
                    value: filteredMerchant.merchantId,
                };
            });
    }
}, [rawMerchantList?.data, userInfo?.merchantId]);
  
  const roleList = useMemo(() => {
    return rawRoles?.data
      ?.filter((rawRole) => rawRole.userType === userType)
      .filter(
        (item) =>
          (item.userType === 2 && item.order > userInfo?.order) ||
          item.userType !== 2
      )
      .map((rawRole: { name: string; id: number; userType: number }) => {
        return {
          label: rawRole.name,
          value: `${rawRole.id}`,
          userType: rawRole?.userType,
        };
      });
  }, [rawRoles?.data, userType]);

  // const userTypeList = useMemo(() => {
  //   return userTypes?.data?.map((userType: { key: string; value: string }) => {
  //     return {
  //       label: userType.key,
  //       value: Number(userType.value),
  //     };
  //   });
  // }, [userTypes?.data]);



  const userTypeList = useMemo(() => {
    if (userInfo.merchantId != 0) {
      return userTypes?.data?.filter((userType: { key: string; value: string }) => Number(userType.value) !== 1)
        .map((userType: { key: string; value: string }) => {
          return {
            label: userType.key,
            value: Number(userType.value),
          };
        });
    } else {
      return userTypes?.data?.map((userType: { key: string; value: string }) => {
        return {
          label: userType.key,
          value: Number(userType.value),
        };
      });
    }
  }, [userTypes?.data, userInfo?.merchantId]);
  



  const merchantId=watch('merchant')

  const onSubmit = ({
    email,
    fullName,
    phoneNumber,
    merchant,
    roleIds,
    userType,
    status,
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
      // merchantId: Number(selectedMerchant?.value) || 0,
      merchantId:  merchantId || 0,
      status: status,
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

  const [isDisabled, setIsDisabled] = useState(Number(userType) === 1);

  useEffect(() => {
    setIsDisabled(Number(userType) === 1);
    if (isDisabled) {
      setSelectedMerchant(null);
      setValue("merchant", 0);
    }
  }, [userType, isDisabled]);

  const handleBack = () => navigate("/dashboard");

  useEffect(() => {
    if (user?.id && !isDisabled && selectedMerchant) {
      setValue("merchant", selectedMerchant.value);
    }
  }, [user, isDisabled, selectedMerchant, setValue]);


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
                sx={{ flex: 1 }}
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

            <Box flex={1}>
              {user?.id ? (
                <Controller
                  name="status"
                  control={control}
                  defaultValue={user?.status || "ACTIVE"}
                  render={({ field: { onChange, value } }) => (
                    <FormControl component="fieldset">
                      <FormLabel component="legend">Kullanıcı Durumu</FormLabel>
                      <RadioGroup
                        aria-label="status"
                        name="status"
                        value={value}
                        onChange={onChange}
                      >
                        <FormControlLabel
                          value="ACTIVE"
                          control={<Radio />}
                          label="Aktif"
                        />
                        <FormControlLabel
                          value="BLOCKED"
                          control={<Radio />}
                          label="Blokeli"
                        />
                      </RadioGroup>
                    </FormControl>
                  )}
                />
              ) : null}
            </Box>
          </Stack>
          <Box sx={{ my: 5, borderBottom: "1px solid #E6E9ED" }} />
          <Stack spacing={3}>
            <Stack
              width={isDesktop ? 800 : "auto"}
              direction={isDesktop ? "row" : "column"}
              spacing={3}
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
              value={merchantList.find(merchant => merchant.value === field.value) || null}
              onChange={(event, selectedValue) => {
                if (!isDisabled) {
                  // // setSelectedMerchant(selectedValue);
                  // setValue("merchant", selectedValue?.value || 0);
                  field.onChange(selectedValue?.value || 0);
                }
              }}
              id="merchant"
              options={merchantList}
              getOptionLabel={(option: {
                label: string;
                value: number;
              }) => option.label}
              disabled={isDisabled}
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