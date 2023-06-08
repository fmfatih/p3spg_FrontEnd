// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/* eslint-disable jsx-a11y/anchor-is-valid */
import {
  IMemberVPos,
  IMerchantVPos,
  useGetBankList,
  useGetDefaultVPosSettingsList,
  useMemberVPosAddWithSettings,
  useGetAllMerchantList,
  useMerchantVPosAddWithSettings,
  useGetAcquirerBankList,
  useAuthorization,
  useGetMemberVPosList,
  useGetMerchantVPosList,
} from "../../../hooks";
import {
  Box,
  FormControl,
  TextField,
  Autocomplete,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Stack } from "@mui/system";
import { useEffect, useMemo, useState } from "react";
import { Button, Loading } from "../../atoms";
import {
  InputControl,
  SelectControl,
  FormatInputControl,
} from "../../molecules";
import { useFieldArray, useForm, Controller } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { useSetSnackBar } from "../../../store/Snackbar.state";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  addBankFormSchema,
  BankAddFormValuesType,
  initialState,
} from "./_formTypes";
import { useUserInfo } from "../../../store/User.state";

export const BankAddForm = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const navigate = useNavigate();
  const { showCreate } = useAuthorization();
  const setSnackbar = useSetSnackBar();
  const memberVPos = useLocation().state as unknown as IMemberVPos | undefined;
  const merchantVPos = useLocation().state as unknown as
    | IMerchantVPos
    | undefined;
  const [userInfo] = useUserInfo();
  const { control, reset, watch, handleSubmit, setValue, errors } =
    useForm<BankAddFormValuesType>({
      resolver: zodResolver(addBankFormSchema),
      defaultValues: initialState,
    });
  const bankCode = watch("bankCode");
  const selectedMerchantId = watch("merchantID");
  const { data: rawAcquirerBankList } = useGetAcquirerBankList();
  const { mutate: getDefaultVposSettingsList } =
    useGetDefaultVPosSettingsList();
  const { mutate: memberVPosAddWithSettings, isLoading } =
    useMemberVPosAddWithSettings();
  const { mutate: merchantVPosAddWithSettings, isLoading: merchantLoading } =
    useMerchantVPosAddWithSettings();
  const { data: rawMerchantList } = useGetAllMerchantList();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "parameters",
  });
  const [vPosList, setVPosList] = useState(null);
  const { mutate: getMemberVPosList, data: rawMemberVPosList } =
    useGetMemberVPosList();

  const { mutate: getMerchantVPosList, data: rawMerchantVPosList } =
    useGetMerchantVPosList();

  const [, setSelectedMerchant] = useState({} as any);
  const handleBack = () => navigate("/dashboard");

  useEffect(() => {
    if (!!memberVPos && JSON.stringify(memberVPos) !== "{}") {
      reset({
        fullName: memberVPos?.fullName,
        mail: memberVPos?.mail,
        phoneNumber: memberVPos.phoneNumber,
        officePhone: memberVPos.officePhone,
        description: memberVPos.description,
        // webAddress: memberVPos.webAddress,
        bankCode: `${memberVPos.bankCode}`,
      });
    }
  }, [reset, memberVPos, setValue]);

  useEffect(() => {
    let req = {};
    if (selectedMerchantId) {
      req = {
        bankCode: bankCode,
        merchantId: selectedMerchantId,
      };
    } else {
      if (merchantVPos?.merchantId) {
        req = {
          bankCode: bankCode,
          merchantId: merchantVPos?.merchantId,
        };
      } else {
        req = {
          bankCode: bankCode,
        };
      }
    }

    if (!!bankCode) {
      getDefaultVposSettingsList(req, {
        onSuccess: (data: { data: Array<{ key: string; type: string }> }) => {
          remove();
          data?.data?.map((item) => {
            const tempOBJ: any = {
              key: item.key,
              label: item.key,
              type: "string",
            };
            if (!!memberVPos) {
              memberVPos?.memberVposSettings?.map((memberVPosItem) => {
                if (
                  memberVPosItem.key.toLowerCase() === item.key.toLowerCase()
                ) {
                  tempOBJ.value = memberVPosItem.value;
                }
              });
            }
            if (!!merchantVPos) {
              merchantVPos?.merchantVposSettings?.map((merchantVPosItem) => {
                if (
                  merchantVPosItem.key.toLowerCase() === item.key.toLowerCase()
                ) {
                  tempOBJ.value = merchantVPosItem.value;
                }
              });
            }

            append(tempOBJ);
          });
        },
      });
    }
  }, [
    append,
    bankCode,
    getDefaultVposSettingsList,
    remove,
    selectedMerchantId,
  ]);

  useEffect(() => {
    if (selectedMerchantId || merchantVPos?.merchantName) {
      getMerchantVPosList({
        orderBy: "CreateDate",
        orderByDesc: true,
        status: "ACTIVE",
      });
    } else {
      getMemberVPosList({
        orderBy: "CreateDate",
        orderByDesc: true,
        status: "ACTIVE",
      });
    }
  }, [
    getMerchantVPosList,
    getMemberVPosList,
    merchantVPos?.merchantName,
    selectedMerchantId,
  ]);

  useEffect(() => {
    if (selectedMerchantId || merchantVPos?.merchantName) {
      setVPosList(
        rawMerchantVPosList?.data?.map((merchantVPos) => ({
          label: merchantVPos.bankName,
          value: merchantVPos.bankCode,
        }))
      );
    } else {
      setVPosList(
        rawMemberVPosList?.data?.map((memberVPos) => ({
          label: memberVPos.bankName,
          value: memberVPos.bankCode,
        }))
      );
    }
  }, [
    rawMerchantVPosList?.data,
    rawMemberVPosList?.data,
    merchantVPos?.merchantName,
    selectedMerchantId,
  ]);

  // const merchantList = useMemo(() => {
  //   return rawMerchantList?.data?.map(
  //     (rawPosType: { merchantName: string; merchantId: number }) => {
  //       return {
  //         label: rawPosType.merchantName,
  //         value: rawPosType.merchantId,
  //       };
  //     }
  //   );
  // }, [rawMerchantList?.data]);

  const merchantList = useMemo(() => {
    if (userInfo?.merchantId === 0) {
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
  }, [rawMerchantList?.data, userInfo.merchantId]);

  const onSubmit = (data: BankAddFormValuesType) => {
    const parameters = data?.parameters?.map((item) => {
      return {
        key: item.key,
        type: item.type,
        value: item.value,
      };
    });

    memberVPosAddWithSettings(
      {
        ...data,
        parameters,
        phoneNumber: data.phoneNumber ? `05${data.phoneNumber}` : "",
        officePhone: data.officePhone ? `05${data.officePhone}` : "",
        defaultBank: false,
        memberId: 1,
        merchantID: selectedMerchantId || 0,
      },
      {
        onSuccess: (data) => {
          if (data.isSuccess) {
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
  };

  return (
    <>
      {isLoading && <Loading />}
      <Stack flex={1} justifyContent="space-between">
        <Stack flex={1} p={2}>
          <Stack spacing={4}>
            <Stack width={isDesktop ? 800 : "auto"} spacing={3} direction="row">
              <FormControl sx={{ width: isDesktop ? "50%" : "100%" }}>
                {!memberVPos?.memberName && merchantList?.length > 0 && (
                  <Controller
                    control={control}
                    name="merchantID"
                    render={() => {
                      return (
                        <>
                          <Autocomplete
                            defaultValue={
                              merchantVPos?.merchantName && {
                                label: merchantVPos?.merchantName,
                                value: merchantVPos?.merchantId,
                              }
                            }
                            sx={{ mr: isDesktop ? 2 : 0 }}
                            onChange={(event, selectedValue) => {
                              setSelectedMerchant(selectedValue);
                              setValue("merchantID", selectedValue?.value);
                            }}
                            id="merchant"
                            options={merchantList}
                            getOptionLabel={(option: {
                              label: string;
                              value: number;
                            }) => option.label}
                            renderInput={(params) => (
                              <TextField {...params} label="Üye İşyeri" />
                            )}
                          />
                        </>
                      );
                    }}
                  />
                )}
              </FormControl>
            </Stack>
            {!selectedMerchantId && !merchantVPos?.merchantName && (
              <>
                <Stack
                  width={isDesktop ? 800 : "auto"}
                  spacing={3}
                  direction={isDesktop ? "row" : "column"}
                >
                  <InputControl
                    sx={{ flex: 1 }}
                    label="Adı Soyadı"
                    control={control}
                    id="fullName"
                  />
                  <InputControl
                    sx={{ flex: 1 }}
                    label="E Posta"
                    control={control}
                    id="mail"
                  />
                </Stack>
                <Stack
                  width={isDesktop ? 800 : "auto"}
                  spacing={3}
                  direction={isDesktop ? "row" : "column"}
                >
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
                  <FormatInputControl
                    sx={{ flex: 1 }}
                    defaultValue=""
                    label="Sabit Telefon Numarası"
                    control={control}
                    id="officePhone"
                    allowEmptyFormatting
                    mask="_"
                    format="0(###) ### ## ##"
                  />
                </Stack>
                <Stack
                  width={isDesktop ? 800 : "auto"}
                  spacing={3}
                  direction="row"
                >
                  <InputControl
                    sx={{ flex: 1 }}
                    label="Açıklama"
                    control={control}
                    id="description"
                  />
                </Stack>
                {/* <Stack
                  width={isDesktop ? 800 : "auto"}
                  spacing={3}
                  direction="row"
                >
                  <InputControl
                    sx={{ flex: 1 }}
                    label="Web Sitesi"
                    control={control}
                    id="webAddress"
                  />
                </Stack> */}
              </>
            )}
          </Stack>
          <Box sx={{ my: 5, borderBottom: "1px solid #E6E9ED" }} />
          <Stack mb={3} spacing={3}>
            <Stack width={isDesktop ? 800 : "auto"} direction="row">
              <FormControl sx={{ width: isDesktop ? "50%" : "100%" }}>
                {vPosList && (
                  <Controller
                    name="bankCode"
                    control={control}
                    defaultValue=""
                    render={({ field: { onChange, value } }) => {
                      const selectedBank = vPosList?.find(
                        (option) => option.value === value
                      );

                      return (
                        <Autocomplete
                          id="bankCode"
                          options={vPosList}
                          getOptionSelected={(option, value) =>
                            option.value === value
                          }
                          getOptionLabel={(option) => option.label}
                          value={selectedBank || null}
                          onChange={(_, newValue) => {
                            onChange(newValue ? newValue.value : "");
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Banka"
                              sx={{ mr: isDesktop ? 3 : 0 }}
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
          {fields?.length ? (
            <Stack direction="row" flexWrap="wrap">
              {fields?.map((field, index) => (
                <Box key={field.id} my={1} mr={3} flex="44%">
                  <InputControl
                    defaultValue=""
                    sx={{ width: "100%" }}
                    id={`parameters.${index}.value`}
                    label={field.key}
                    control={control}
                    tooltipText={field.label}
                    showInfoIcon={true}
                  />
                </Box>
              ))}
            </Stack>
          ) : null}
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
              text={!!memberVPos?.id ? "Güncelle" : "Kaydet"}
            />
          )}
          <Button onClick={handleBack} sx={{ mx: 2 }} text={"Iptal"} />
        </Stack>
      </Stack>
    </>
  );
};
