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

  const [, setSelectedMerchant] = useState({} as any);
  const handleBack = () => navigate("/dashboard");

  useEffect(() => {
    if (!!memberVPos && JSON.stringify(memberVPos) !== "{}") {
      console.log("memberVPos", memberVPos);
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
  }, [reset, memberVPos, setValue,]);

  // useEffect(() => {
  //   if (!!merchantVPos && JSON.stringify(merchantVPos) !== "{}") {
  //     reset({
  //       fullName: merchantVPos?.fullName,
  //       mail: merchantVPos?.mail,
  //       phoneNumber: merchantVPos.phoneNumber,
  //       officePhone: merchantVPos.officePhone,
  //       description: merchantVPos.description,
  //       bankCode: `${merchantVPos.bankCode}`,
  //     });
  //   }
  // }, [reset, merchantVPos, setValue]);

  useEffect(() => {
    let req = {};
    if (selectedMerchantId) {
      req = {
        bankCode: bankCode,
        merchantId: selectedMerchantId,
      };
    } else {
      req = {
        bankCode: bankCode,
      };
    }

    if (!!bankCode) {
      getDefaultVposSettingsList(req, {
        onSuccess: (data: {
          data: Array<{ key: string; type: string; label: string }>;
        }) => {
          remove();
          data?.data?.map((item) => {
            const tempOBJ: any = {
              key: item.key,
              label: item?.label,
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
  console.log(memberVPos)

  const acquirerBankList = useMemo(() => {
    return rawAcquirerBankList?.data?.map(
      (bank: { bankCode: string; bankName: string }) => {
        return {
          label: `${bank.bankName}`,
          value: bank.bankCode,
        };
      }
    );
  }, [rawAcquirerBankList?.data]);

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

  const onSubmit = (data: BankAddFormValuesType) => {
    console.log(data);
    const parameters = data?.parameters?.map((item) => {
      return {
        key: item.key,
        type: item.type,
        value: item.value,
      };
    });

    if (memberVPos?.memberId && memberVPos?.memberName) {
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
    }

    if (merchantVPos?.merchantId && merchantVPos?.merchantName) {
      merchantVPosAddWithSettings(
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
    }
  };

  console.log(selectedMerchantId);
  console.log(merchantVPos);
  console.log(merchantList);

  return (
    <>
      {isLoading && <Loading />}
      <Stack flex={1} justifyContent="space-between">
        <Stack flex={1} p={2}>
          <Stack spacing={4}>
            <Stack width={isDesktop ? 800 : "auto"} spacing={3} direction="row">
              <FormControl sx={{ width: isDesktop ? "50%" : "100%" }}>
                {merchantList?.length > 0 && (
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
                            //defaultValue={selectedMerchant}
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
                    defaultValue=""
                    label="Telefon Numarası"
                    control={control}
                    id="phoneNumber"
                    allowEmptyFormatting
                    mask="_"
                    format="0(###) ### ## ##"
                  />
                  <FormatInputControl
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
                {acquirerBankList && (
                  <SelectControl
                    sx={{ mr: isDesktop ? 3 : 0 }}
                    id="bankCode"
                    control={control}
                    label="Banka"
                    items={acquirerBankList}
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
