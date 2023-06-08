// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/* eslint-disable jsx-a11y/anchor-is-valid */
import {
  CheckboxesControl,
  InputControl,
  RadioButtonsControl,
  SelectControl,
  DatePickerControl,
} from "../../molecules";
import {
  Box,
  FormControl,
  Stack,
  Typography,
  Autocomplete,
  TextField,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { Button, Loading } from "../../atoms";
import {
  useGetMerchantCategoryList,
  useMerchantAdd,
  useGetMerchantTypeList,
  useGetPosTypeList,
  useGetAllMerchantList,
  useGetCommissionProfileList,
  useGetCityList,
  useGetTaxAdministrationList,
  useGetMerchantStatusList,
  IMerchantAddRequest,
  IMerchant,
  useMerchantUpdate,
  useAuthorization,
} from "../../../hooks";
import { useEffect, useMemo, useState } from "react";
import { useUserMerchantId } from "./Merchant.state";
import { useSetSnackBar } from "../../../store/Snackbar.state";
import {
  firstStepFormSchema,
  FirstStepFormValuesType,
  firstStepInitialValues,
} from "./_formTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { default as dayjs } from "dayjs";
import { useUserInfo } from "../../../store/User.state";


type MerchantAddFormCompanyStepProps = {
  onNext: () => void;
  merchant?: IMerchant;
  allData?: any;
  setAllData?: any;
};

export const MerchantAddFormCompanyStep = ({
  merchant,
  onNext,
  allData,
  setAllData,
}: MerchantAddFormCompanyStepProps) => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const { showCreate } = useAuthorization();
  const { mutate: addMerchant, isLoading } = useMerchantAdd();
  const { mutate: updateMerchant, isLoading: updateLoading } =
    useMerchantUpdate();
  const [test, setMerchantId] = useUserMerchantId();
  const [taxAdministrations, setTaxAdministrations] = useState([]);
  const { data: rawMerchantStatus, isLoading: isMerchantStatusLoading } =
    useGetMerchantStatusList({});
  const { data: rawMerchantTypes, isLoading: isMerchantTypeLoading } =
    useGetMerchantTypeList({});
  const { data: rawPosTypes, isLoading: isPosTypeLoading } = useGetPosTypeList(
    {}
  );
  const [userInfo] = useUserInfo();
  const { data: rawMerchantList, isLoading: isMerchantListLoading } =
    useGetAllMerchantList();
  const {
    data: rawMerchantCategoryList,
    isLoading: isMerchantCategoryLoading,
  } = useGetMerchantCategoryList({});
  const {
    data: rawCommissionProfileList,
    isLoading: isCommissionProfileListLoading,
  } = useGetCommissionProfileList({});
  const { data: rawCityList, isLoading: isCityListLoading } = useGetCityList(
    {}
  );
  const { mutate: getTaxAdministrationList, isLoading: isTaxListLoading } =
    useGetTaxAdministrationList();
  const { control, reset, handleSubmit, setValue, getValues,watch} =
    useForm<FirstStepFormValuesType>({
      resolver: zodResolver(firstStepFormSchema),
      defaultValues: firstStepInitialValues,
    });
  const [selectedCity, setSelectedCity] = useState(null as any);
  const [selectedMcc, setSelectedMcc] = useState(null as any);
  const [selectedMerchant, setSelectedMerchant] = useState(null as any);

  const setSnackbar = useSetSnackBar();

  useEffect(() => {
    selectedCity &&
      getTaxAdministrationList(
        { cityCode: `${selectedCity.value}` },
        {
          onSuccess(data) {
            const tempData = data?.data?.map(
              (item: { name: string; taxAdministrationCode: string }) => {
                return {
                  label: item.name,
                  value: `${item.taxAdministrationCode}`,
                };
              }
            );
            setTaxAdministrations(tempData);
          },
        }
      );
  }, [getTaxAdministrationList, selectedCity]);

  const merchantTypes = useMemo(() => {
    return rawMerchantTypes?.data?.map(
      (merchantType: { value: string; key: number }) => {
        return {
          label: merchantType.value,
          value: `${merchantType.key}`,
        };
      }
    );
  }, [rawMerchantTypes?.data]);

  const merchantStatuses = useMemo(() => {
    return rawMerchantStatus?.data?.map(
      (merchantStat: { value: string; key: number }) => {
        return {
          label: merchantStat.key,
          value: `${merchantStat.value}`,
        };
      }
    );
  }, [rawMerchantStatus?.data]);

  const posTypes = useMemo(() => {
    return rawPosTypes?.data?.map(
      (rawPosType: { key: string; value: string }) => {
        return {
          label: rawPosType.value,
          value: rawPosType.key,
        };
      }
    );
  }, [rawPosTypes?.data]);

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
 
    if (userInfo.merchantId === 0) {
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

  const commissionProfileList = useMemo(() => {
    return rawCommissionProfileList?.data?.map(
      (rawPosType: { name: string; code: string }) => {
        return {
          label: rawPosType.name,
          value: `${rawPosType.code}`,
        };
      }
    );
  }, [rawCommissionProfileList?.data]);

  const cityList = useMemo(() => {
    return rawCityList?.data?.map((city: { name: string; cityCode:string }) => {
      return {
        label: city.name,
        value: city.cityCode,
      };
    });
  }, [rawCityList?.data]);

  

  const merchantCategoryList = useMemo(() => {
    return rawMerchantCategoryList?.data?.map(
      (rawMerchantCategory: { description: string; code: string }) => {
        return {
          label: `${rawMerchantCategory.code} - ${rawMerchantCategory.description}`,
          value: `${rawMerchantCategory.code}`,
        };
      }
    );
  }, [rawMerchantCategoryList?.data]);

  const onSubmit = ({
    merchantStatusType,
    parentMerchantId,
    posList,
    taxOfficeCode,
    tradeRegistrationNumber,
    tradeName,
    aggreementDate,
    openingDate,
    mcc,
    foundationDate,
    citizenshipNumber,
    taxNumber,
    merchantType,
    merchantName,
    commissionProfileCode,
    webSite,
    closedDate,
  }: FirstStepFormValuesType) => {
    const taxOffice = taxAdministrations?.find(
      (item: { value: string }) => item?.value === taxOfficeCode
    ) as unknown as { value: string; label: string };

    const request: IMerchantAddRequest = {
      memberId: 1,
      merchantType: +merchantType,
      merchantStatusType,
      mobilePos: false,
      vpos: false,
      pos: false,
      parentMerchantId: selectedMerchant?.value
        ? Number(selectedMerchant?.value)
        : 0,
      merchantName,
      tradeName,
      tradeRegistrationNumber,
      commissionProfileCode,
      webSite,
      taxNumber,
      taxOfficeCode,
      taxOfficeName: taxOffice.label,
      citizenshipNumber,
      mcc: selectedMcc?.value,
      //foundationDate: "",
      openingDate: openingDate ? dayjs(openingDate).format("YYYY-MM-DD") : null,
      aggreementDate: aggreementDate
        ? dayjs(aggreementDate).format("YYYY-MM-DD")
        : null,
      closedDate: closedDate ? dayjs(closedDate).format("YYYY-MM-DD") : null,
      phoneNumber: "",
      description: "",
      ...posList,
    };

    if ((merchant && merchant?.id > 0) || (allData && allData?.merchantType)) {
      updateMerchant(
        {
          ...request,
          id: allData?.id || 0,
          merchantId: merchant?.merchantId || allData?.merchantId || 0,
        },
        {
          onSuccess(data) {
            const merchantId = data.data.merchantId;
            setMerchantId(merchantId);
            setAllData({   ...request,...allData, merchantId: merchantId});
            console.log(allData);
            console.log(request);
            
            if (data.isSuccess) {
              onNext();
              
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
          onError: (error) => {
            setSnackbar({
              severity: "error",
              isOpen: true,
              description: "İşlem sırasında bir hata oluştu",
            });
          },
        }
      );
    } else {
      addMerchant(request, {
        onSuccess(data) {
          const merchantId = data.data.merchantId;
          const id = data.data.id;
          setMerchantId(merchantId);
          setAllData({ ...allData, ...request, merchantId: merchantId, id });

          if (data.isSuccess) {
            onNext();
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
        onError: (error) => {
          setSnackbar({
            severity: "error",
            isOpen: true,
            description: "İşlem sırasında bir hata oluştu",
          });
        },
      });
    }
  };

  const city=watch("city")
const mcc=watch("mcc")

  

  useEffect(() => {
    if (!!merchant && JSON.stringify(merchant) !== "{}") {
      if (selectedCity === null || selectedCity === undefined) {
        setSelectedCity(
          cityList?.find(
            (c: any) =>
              c.value === merchant?.taxOfficeCode?.toString().substring(0, 2)
          )
        );
      }

      if (selectedMcc === null || selectedMcc === undefined) {
        setSelectedMcc(
          merchantCategoryList?.find((mcc: any) => mcc?.value === merchant?.mcc)
        );
      }

      if (selectedMerchant === null || selectedMerchant === undefined) {
        setSelectedMerchant(
          merchantList?.find(
            (merc: any) => merc?.value === merchant?.parentMerchantId
          )
        );
      }



      reset({
        merchantType: `${merchant.merchantType}`,
        parentMerchantId: merchant.parentMerchantId,
        merchantStatusType: merchant.merchantStatusType,
        merchantName: merchant.merchantName,
        tradeName: merchant.tradeName,
        tradeRegistrationNumber: merchant.tradeRegistrationNumber,
        commissionProfileCode: merchant.commissionProfileCode,
        webSite: merchant.webSite,
        city: selectedCity,
        taxNumber: merchant.taxNumber,
        taxOfficeCode: merchant.taxOfficeCode,
        citizenshipNumber: merchant.citizenshipNumber,
        mcc: merchant.mcc,
        openingDate: dayjs(merchant.openingDate),
        aggreementDate: dayjs(merchant.aggreementDate),
        postList:merchant.pos,
        posList: {
          vpos: merchant?.vpos,
          pos: merchant?.pos,
          mobilePos: merchant?.mobilePos,
        },

        //foundationDate: dayjs(merchant.foundationDate),
      });
    }
  }, [
    cityList,
    merchant,
    merchantCategoryList,
    posTypes,
    reset,
    selectedCity,
    selectedMcc,
    setValue,
  ]);
  useEffect(() => {
    if (merchant && merchant.taxOfficeCode) {
      const cityCode = merchant.taxOfficeCode.substring(0, 2);
      const cityRelatedToTaxOfficeCode = cityList?.find(city => city.value === cityCode);
      
      setSelectedCity(cityRelatedToTaxOfficeCode);
    }
  }, [merchant, cityList]);

  const hasLoading =
    isMerchantCategoryLoading ||
    isLoading ||
    isMerchantListLoading ||
    isMerchantStatusLoading ||
    updateLoading ||
    isMerchantStatusLoading ||
    isMerchantTypeLoading ||
    isPosTypeLoading ||
    isCommissionProfileListLoading ||
    isCityListLoading ||
    isTaxListLoading;
  return (
    <>
      {hasLoading ? (
        <Loading />
      ) : (
        <Stack pt={3} flex={1} justifyContent="space-between">
          <Stack px={isDesktop ? 4 : 1} mb={3} spacing={3}>
            <Stack
              width={isDesktop ? 800 : "auto"}
              spacing={4}
              direction={isDesktop ? "row" : "column"}
            >
              <Box sx={{ width: isDesktop ? "50%" : "100%" }}>
                <Typography color="text.default" variant="overline">
                  İşyeri Tipi
                </Typography>
                {merchantTypes && (
                  <RadioButtonsControl
                    row
                    id="merchantType"
                    control={control}
                    defaultValue={merchantTypes[0]?.value}
                    items={merchantTypes}
               
                  />
                )}
              </Box>
              <Box sx={{ width: isDesktop ? "50%" : "100%" }}>
                <Typography color="text.default" variant="overline">
                  POS Tipi
                </Typography>
                {posTypes && (
                  <CheckboxesControl
                    row
                    id="posList"
                    control={control}
                    items={posTypes}
                  />
                )}
              </Box>
            </Stack>
            <Stack
              width={isDesktop ? 800 : "auto"}
              spacing={3}
              direction={isDesktop ? "row" : "column"}
              sx={{
                "& > :nth-of-type(1)": {
                  flexBasis: "50%",
                },
                "& > :nth-of-type(2)": {
                  flexBasis: "50%",
                },
              }}
            >
              <FormControl sx={{ width: isDesktop ? "50%" : "100%" }}>
                {merchantList && (
                  <Controller
                    control={control}
                    name="parentMerchantId"
                    render={(fieldState) => {
                      return (
                        <>
                          <Autocomplete
                            sx={{ mr: isDesktop ? 3 : 0 }}
                            onChange={(event, selectedValue) => {
                              setSelectedMerchant(selectedValue);
                              setValue(
                                "parentMerchantId",
                                selectedValue?.value || 0
                              );
                            }}
                            id="parentMerchantId"
                            options={merchantList}
                            value={selectedMerchant}
                            getOptionLabel={(option: {
                              label: string;
                              value: number;
                            }) => option.label}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Ana İşyeri"
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
                {merchantStatuses ? (
                  <Controller
                    name="merchantStatusType"
                    control={control}
                    defaultValue=""
                    render={({ field: { onChange, value }, fieldState }) => {
                      const selectedMerchantStatus = merchantStatuses.find(
                        (option) => option.value === value
                      );

                      return (
                        <Autocomplete
                          id="merchantStatusType"
                          options={merchantStatuses}
                          getOptionSelected={(option, value) =>
                            option.value === value
                          }
                          getOptionLabel={(option) => option.label}
                          value={selectedMerchantStatus || null}
                          onChange={(_, newValue) => {
                            onChange(newValue ? newValue.value : "");
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="İşyeri Durumu"
                              error={fieldState.invalid}
                            />
                          )}
                        />
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
              sx={{
                "& > :nth-of-type(1)": {
                  flexBasis: "50%",
                },
                "& > :nth-of-type(2)": {
                  flexBasis: "50%",
                },
              }}
            >
              <FormControl sx={{ width: isDesktop ? "50%" : "100%" }}>
                <InputControl
                  sx={{ mr: isDesktop ? 3 : 0 }}
                  id="merchantName"
                  control={control}
                  label="İşyeri Adı"
                />
              </FormControl>
              <FormControl sx={{ width: isDesktop ? "50%" : "100%" }}>
                <InputControl
                  sx={{ mr: isDesktop ? 0 : 0 }}
                  id="tradeName"
                  control={control}
                  label="İşyeri Ticari Adı"
                />
              </FormControl>
            </Stack>
            <Stack
              width={isDesktop ? 800 : "auto"}
              spacing={3}
              direction={isDesktop ? "row" : "column"}
              sx={{
                "& > :nth-of-type(1)": {
                  flexBasis: "50%",
                },
                "& > :nth-of-type(2)": {
                  flexBasis: "50%",
                },
              }}
            >
              <FormControl sx={{ width: isDesktop ? "50%" : "100%" }}>
                <InputControl
                  sx={{ mr: isDesktop ? 3 : 0 }}
                  id="tradeRegistrationNumber"
                  control={control}
                  label="Sicil No"
                  numeric
                />
              </FormControl>
              <FormControl sx={{ width: isDesktop ? "44%" : "100%" }}>
                {commissionProfileList ? (
                  <Controller
                    name="commissionProfileCode"
                    control={control}
                    defaultValue=""
                    render={({ field: { onChange, value }, fieldState }) => {
                      const selectedCommissionProfile =
                        commissionProfileList.find(
                          (option) => option.value === value
                        );

                      return (
                        <Autocomplete
                          id="commissionProfileCode"
                          options={commissionProfileList}
                          getOptionSelected={(option, value) =>
                            option.value === value
                          }
                          getOptionLabel={(option) => option.label}
                          value={selectedCommissionProfile || null}
                          onChange={(_, newValue) => {
                            onChange(newValue ? newValue.value : "");
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Çalışma Grubu"
                              error={fieldState.invalid}
                            />
                          )}
                        />
                      );
                    }}
                  />
                ) : null}
              </FormControl>
            </Stack>
            <FormControl sx={{ width: isDesktop ? 800 : "auto" }}>
              <InputControl
                sx={{ mr: isDesktop ? 0 : 0 }}
                id="webSite"
                control={control}
                label="Web Sitesi"
              />
            </FormControl>
            <Stack
              width={isDesktop ? 800 : "auto"}
              spacing={3}
              direction={isDesktop ? "row" : "column"}
            >
              <FormControl sx={{ width: isDesktop ? "50%" : "100%" }}>
                {cityList && (
                  <Controller
                    control={control}
                    name="city"
                    render={({ field: { onChange, value }, fieldState }) => {
                      return (
                        <>
                          <Autocomplete
                            sx={{ mr: isDesktop ? 3 : 0 }}
                            id="city"
                            options={cityList}
                            value={selectedCity || null}
                            onChange={(event, selectedValue) => {
                              setSelectedCity(selectedValue);
                              onChange(selectedValue);
                            }}
                            getOptionLabel={(option: {
                              label: string;
                              value: number;
                            }) => option.label}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Vergi Dairesi İli"
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
                <InputControl
                  sx={{ mr: isDesktop ? 0 : 0 }}
                  id="taxNumber"
                  control={control}
                  label="Vergi Numarası"
                  numeric
                  maxLength={10}
                />
              </FormControl>
            </Stack>
            <Stack
              width={isDesktop ? 800 : "auto"}
              spacing={6}
              direction={isDesktop ? "row" : "column"}
            >
              <FormControl sx={{ width: isDesktop ? "46%" : "100%" }}>
                {taxAdministrations ? (
                  <Controller
                    name="taxOfficeCode"
                    control={control}
                    defaultValue=""
                    render={({ field: { onChange, value }, fieldState }) => {
                      const selectedTaxAdministration = taxAdministrations.find(
                        (option) => option.value === value
                      );

                      return (
                        <Autocomplete
                          id="taxOfficeCode"
                          options={taxAdministrations}
                          getOptionSelected={(option, value) =>
                            option.value === value
                          }
                          getOptionLabel={(option) => option.label}
                          value={selectedTaxAdministration || null}
                          onChange={(_, newValue) => {
                            onChange(newValue ? newValue.value : "");
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Vergi Dairesi"
                              error={fieldState.invalid}
                            />
                          )}
                        />
                      );
                    }}
                  />
                ) : null}
              </FormControl>

              <FormControl sx={{ width: isDesktop ? "50%" : "100%" }}>
                <InputControl
                  sx={{ mr: isDesktop ? 0 : 0 }}
                  id="citizenshipNumber"
                  control={control}
                  label="Kimlik Numarası"
                  numeric
                  maxLength={11}
                />
              </FormControl>
            </Stack>
            <Stack
              width={isDesktop ? 800 : "auto"}
              spacing={3}
              direction={isDesktop ? "row" : "column"}
            >
<FormControl sx={{ width: isDesktop ? "50%" : "100%" }}>
  {merchantCategoryList && (
    <Controller
      control={control}
      name="mcc"
      defaultValue=""
      rules={{ required: true }} // Bu satırı ekledik, böylece alanın doldurulması zorunlu olur.
      render={({ field: { onChange, value }, fieldState }) => {
        const selectedMerchantCategory =
          merchantCategoryList.find((option) => option.value === value);

        return (
          <>
            <Autocomplete
              sx={{ mr: isDesktop ? 3 : 0 }}
              options={merchantCategoryList}
              getOptionLabel={(option) => option.label}
              value={selectedMerchantCategory || null}
              onChange={(_, newValue) => {
                onChange(newValue ? newValue.value : "");
                if (newValue) setSelectedMcc(newValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="MCC"
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
                <DatePickerControl
                  sx={{ mr: isDesktop ? 0 : 0 }}
                  id="openingDate"
                  control={control}
                  label="İşyeri Açılış Tarihi"
                  defaultValue={dayjs()}
                />
              </FormControl>
            </Stack>
            <Stack
              width={isDesktop ? 800 : "auto"}
              spacing={3}
              direction={isDesktop ? "row" : "column"}
            >
              <FormControl sx={{ width: isDesktop ? "50%" : "100%" }}>
                <DatePickerControl
                  sx={{ mr: isDesktop ? 3 : 0 }}
                  id="aggreementDate"
                  control={control}
                  label="İşyeri Sözleşme Tarihi"
                  defaultValue={dayjs()}
                />
              </FormControl>
              <FormControl sx={{ width: isDesktop ? "50%" : "100%" }}>
                <DatePickerControl
                  sx={{ mr: isDesktop ? 0 : 0 }}
                  id="closedDate"
                  control={control}
                  label="İşyeri Kapanış Tarihi"
                />
              </FormControl>
            </Stack>
          </Stack>
          <Stack
            borderTop="1px solid #E6E9ED"
            direction="row"
            py={2}
            px={4}
            justifyContent="flex-end"
          >
            {!!showCreate && (
              <Button
                variant="contained"
                text="Devam"
                onClick={handleSubmit(onSubmit)}
              />
            )}
          </Stack>
        </Stack>
      )}
    </>
  );
};
