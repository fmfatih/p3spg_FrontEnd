import {
  IVPosRouting,
  useAddVPosRouting,
  useGetCardTypeList,
  useGetAllMerchantList,
  useUpdateVPosRouting,
  useGetIssuerBankList,
  useGetAcquirerBankList,
  useGetTransactionSubTypeSettingsList,
  useAuthorization,
} from "../../../hooks";
import {
  Box,
  FormControl,
  Autocomplete,
  TextField,
  Checkbox,
  useTheme,
  useMediaQuery,
} from "@mui/material";

import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { Stack } from "@mui/system";
import { useEffect, useMemo, useState } from "react";
import { Button, Loading } from "../../atoms";
import { SelectControl, SwitchControl } from "../../molecules";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  addBankRedirectFormSchema,
  BankAddRedirectFormValuesType,
  initialBankAddRedirectState,
} from "./_formTypes";
import { useLocation, useNavigate } from "react-router-dom";
import { useSetSnackBar } from "../../../store/Snackbar.state";
import { useUserInfo } from "../../../store/User.state";

export const BankRedirectAddForm = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const vPosRouting = useLocation().state as unknown as IVPosRouting;
  const {showCreate} = useAuthorization();
  const [userInfo] = useUserInfo();
  const { control, reset, handleSubmit, setValue } =
    useForm<BankAddRedirectFormValuesType>({
      resolver: zodResolver(addBankRedirectFormSchema),
      defaultValues: initialBankAddRedirectState,
    });
  const { data: rawIssuerBankList } = useGetIssuerBankList();
  const { data: rawAcquirerBankList } = useGetAcquirerBankList();
  const { data: rawMerchantList } = useGetAllMerchantList();
  const { data: rawCardTypeList } = useGetCardTypeList({});
  const { data: rawTransactionSubTypeList } =
    useGetTransactionSubTypeSettingsList({});
  const { mutate: addVPosRouting, isLoading } = useAddVPosRouting();
  const { mutate: updateVPosRouting, isLoading: isUpdateLoading } =
    useUpdateVPosRouting();
  const setSnackbar = useSetSnackBar();

  const transactionSubTypeList = useMemo(() => {
    return rawTransactionSubTypeList?.data?.map(
      (resourceType: { value: string; key: string }) => {
        return {
          label: resourceType.value,
          value: `${resourceType.key}`,
        };
      }
    );
  }, [rawTransactionSubTypeList?.data]);

  const [selectedMerchant, setSelectedMerchant] = useState(() => {
    setValue("merchantId", Number(userInfo.merchantId));
    return Number(userInfo.merchantId) !== 0
      ? { label: userInfo.merchantName, value: Number(userInfo.merchantId) }
      : null;
  });

  const [selectedMerchantVPosBankCode, setSelectedMerchantVPosBankCode] =
    useState(null as any);
  const [selectedIssuerBankCodeValues, setSelectedIssuerBankCodeValues] =
    useState([] as any);
  const [selectedIssuerBankCodeObjects, setSelectedIssuerBankCodeObjects] =
    useState([] as any);

  const issuerBankList = useMemo(() => {
    return rawIssuerBankList?.data?.map(
      (bank: { bankCode: string; bankName: string }) => {
        return {
          label: `${bank.bankName}`,
          value: bank.bankCode,
        };
      }
    );
  }, [rawIssuerBankList?.data]);

  const acquirerBankList = useMemo(() => {
    return rawAcquirerBankList?.data?.map(
      (bank: { bankCode: string; bankName: string }) => {
        return {
          label: `${bank.bankName}`,
          value: `${bank.bankCode}`,
        };
      }
    );
  }, [rawAcquirerBankList?.data]);

  const merchantList = useMemo(() => {
    return rawMerchantList?.data?.map(
      (merchant: { merchantName: string; merchantId: number }) => {
        return {
          label: `${merchant.merchantName}`,
          value: merchant.merchantId,
        };
      }
    );
  }, [rawMerchantList?.data]);

  const cardTypeList = useMemo(() => {
    return rawCardTypeList?.data?.map(
      (cardType: { key: string; value: string }) => {
        return {
          label: `${cardType.value}`,
          value: cardType.key,
        };
      }
    );
  }, [rawCardTypeList?.data]);

  const onSubmit = (data: BankAddRedirectFormValuesType) => {
    if (vPosRouting && vPosRouting.id > 0) {
      updateVPosRouting(
        {
          ...data,
          id: vPosRouting?.id,
          memberId: 1,
          merchantId: Number(selectedMerchant?.value),
          issuerCardBankCodes: selectedIssuerBankCodeValues,
          merchantVposBankCode: selectedMerchantVPosBankCode?.value?.toString(),
        },
        {
          onSuccess: (data) => {
            if (data.isSuccess) {
              //navigate("/banks/redirect");
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
      addVPosRouting(
        {
          ...data,
          memberId: 1,
          merchantId: Number(selectedMerchant?.value),
          issuerCardBankCodes: selectedIssuerBankCodeValues,
          merchantVposBankCode: selectedMerchantVPosBankCode?.value?.toString(),
        },
        {
          onSuccess: (data) => {
            if (data.isSuccess) {
              //navigate("/banks");
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

  useEffect(() => {
    if (!!vPosRouting && JSON.stringify(vPosRouting) !== "{}") {
      reset({
        onusRouting: true,
        merchantId: vPosRouting?.merchantId,
        issuerCardBankCodes: [
          {
            label: vPosRouting?.issuerCardBankName?.toString(),
            value:
              vPosRouting?.issuerCardBankCodes?.length > 0 &&
              vPosRouting?.issuerCardBankCodes[0]?.toString(),
          },
        ],
        issuerCardType: vPosRouting?.issuerCardType,
        merchantVposBankCode: {
          label: vPosRouting?.merchantVposBankName,
          value: vPosRouting?.merchantVposBankCode,
        },
        transactionSubType: vPosRouting?.transactionSubType,
      });

      setSelectedMerchantVPosBankCode({
        label: vPosRouting?.merchantVposBankName,
        value: vPosRouting?.merchantVposBankCode,
      });

      setSelectedIssuerBankCodeValues(
        vPosRouting?.issuerCardBankCodes?.length > 0 && [
          vPosRouting?.issuerCardBankCodes[0],
        ]
      );
      setSelectedIssuerBankCodeObjects([
        {
          label: vPosRouting?.issuerCardBankName?.toString(),
          value:
            vPosRouting?.issuerCardBankCodes?.length > 0 &&
            vPosRouting?.issuerCardBankCodes[0]?.toString(),
        },
      ]);
    }
  }, [vPosRouting, reset]);

  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;

  const handleBack = () => navigate("/dashboard");

  return (
    <>
      {(isLoading || isUpdateLoading) && <Loading />}
      <Stack flex={1} justifyContent="space-between">
        <Stack flex={1} p={2}>
          <Stack spacing={4}>
            <Stack width={isDesktop ? 800 : "auto"} spacing={3} direction="row">
              <SwitchControl
                label="On Us Yönlendirilsin"
                control={control}
                id="onusRouting"
              />
              {isDesktop && <Box flex={1} />}
            </Stack>
            <Stack width={isDesktop ? 800 : "auto"} spacing={3} direction="row">
              <FormControl sx={{ flex: 1 }}>
                {merchantList ? (
                  <Controller
                    control={control}
                    name="merchantId"
                    render={() => {
                      return (
                        <>
                          <Autocomplete
                            sx={{ mr: isDesktop ? 3 : 0 }}
                            onChange={(event, selectedValue) => {
                              setSelectedMerchant(selectedValue);
                              setValue("merchantId", selectedValue?.value || 0);
                            }}
                            id="merchantId"
                            options={merchantList}
                            defaultValue={selectedMerchant}
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
                ) : null}
              </FormControl>
            </Stack>
            <Stack
              width={isDesktop ? 800 : "auto"}
              spacing={3}
              direction={isDesktop ? "row" : "column"}
            >
              <FormControl sx={{ flex: 1 }}>
                {cardTypeList ? (
                  <SelectControl
                    sx={{ mr: isDesktop ? 3 : 0 }}
                    id="issuerCardType"
                    control={control}
                    label="Kart Tipi"
                    items={cardTypeList}
                  />
                ) : null}
              </FormControl>
              <FormControl sx={{ flex: 1 }}>
                {transactionSubTypeList ? (
                  <SelectControl
                    sx={{ mr: isDesktop ? 3 : 0 }}
                    id="transactionSubType"
                    control={control}
                    label="İşlem Tipi"
                    items={transactionSubTypeList}
                  />
                ) : null}
              </FormControl>
            </Stack>
            <Stack width={isDesktop ? 800 : "auto"} spacing={3} direction="row">
              <FormControl sx={{ flex: 1 }}>
                {issuerBankList ? (
                  <Controller
                    control={control}
                    name="issuerCardBankCodes"
                    render={() => {
                      return (
                        <Autocomplete
                          sx={{ mr: isDesktop ? 3 : 0 }}
                          multiple
                          id="issuerCardBankCodes"
                          onChange={(event, selectedValue) => {
                            let valueList: Array<string> = [];
                            let tempObj: Array<T> = [];
                            selectedValue?.map(
                              (e: { label: string; value: string }) => {
                                valueList.push(e.value);
                                tempObj.push(e);
                              }
                            );
                            setSelectedIssuerBankCodeObjects(tempObj);
                            setSelectedIssuerBankCodeValues(valueList);
                          }}
                          options={issuerBankList}
                          disableCloseOnSelect
                          value={selectedIssuerBankCodeObjects}
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
                              label="Yönlendirilecek Kartın Bankası"
                            />
                          )}
                        />
                      );
                    }}
                  />
                ) : null}
              </FormControl>
            </Stack>
            <Stack width={isDesktop ? 800 : "auto"} spacing={3} direction="row">
              <FormControl sx={{ flex: 1 }}>
                {acquirerBankList ? (
                  <Controller
                    control={control}
                    name="merchantVposBankCode"
                    render={() => {
                      return (
                        <>
                          <Autocomplete
                            sx={{ mr: isDesktop ? 3 : 0 }}
                            onChange={(event, selectedValue) => {
                              setSelectedMerchantVPosBankCode(selectedValue);
                            }}
                            id="merchantVposBankCode"
                            options={acquirerBankList}
                            value={selectedMerchantVPosBankCode}
                            getOptionLabel={(option: {
                              label: string;
                              value: string;
                            }) => option.label}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Yönlendirilecek Sanal POS"
                              />
                            )}
                          />
                        </>
                      );
                    }}
                  />
                ) : null}
              </FormControl>
            </Stack>
            <Box flex={1}></Box>
          </Stack>

          <Box sx={{ my: 5, borderBottom: "1px solid #E6E9ED" }} />
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
              text={vPosRouting && vPosRouting.id > 0 ? "Güncelle" : "Kaydet"}
            />
          )}
          <Button onClick={handleBack} sx={{ mx: 2 }} text={"Iptal"} />
        </Stack>
      </Stack>
    </>
  );
};
