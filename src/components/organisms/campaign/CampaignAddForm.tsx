import {  useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { FormControl, Autocomplete, TextField, Checkbox, useTheme, useMediaQuery } from "@mui/material";
import { Button } from "../../atoms";
import { Stack } from "@mui/system";
import { default as dayjs } from "dayjs";
import {
  useGetAllMerchantList,
  useGetAcquirerBankList,
  useGetCardBinList,
  useGetCardTypeList,
  useCampaignAdd,
  ICampaignAddRequest,
  useAuthorization,
} from "../../../hooks";
import {  useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { addCampaignFormSchema, CampaignAddFormValuesType } from "./_formTypes";
import {
  SelectControl,
  InputControl,
  DatePickerControl,
  NumericFormatInputControl,
} from "../../molecules";
import { useSetSnackBar } from "../../../store/Snackbar.state";
import { useUserInfo } from "../../../store/User.state";

export const CampaignAddForm = () => {
  const theme = useTheme();
  const {showCreate} = useAuthorization();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const { mutate: CampaignAdd } =
    useCampaignAdd();
  const navigate = useNavigate();
  const [userInfo] = useUserInfo();
  const { data: rawMerchantList } = useGetAllMerchantList();
  const { data: rawAcquirerBankList } = useGetAcquirerBankList();
  const { data: rawCardBinList } = useGetCardBinList({});
  const { data: rawCardTypeList } = useGetCardTypeList({});
  const { handleSubmit, control, setValue, getValues } =
    useForm<CampaignAddFormValuesType>({
      resolver: zodResolver(addCampaignFormSchema),
    });
  const setSnackbar = useSetSnackBar();

  const [selectedMerchantId] = useState(0 as any);
  const [selectedBins, setSelectedBins] = useState([] as any);

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

  const cardBinList = useMemo(() => {
    return rawCardBinList?.data?.map((bank: { bin: string; id: number }) => {
      return {
        label: `${bank.bin}`,
        value: bank.id,
      };
    });
  }, [rawCardBinList?.data]);

  const cardTypeList = useMemo(() => {
    return rawCardTypeList?.data?.map(
      (cardType: { key: string; value: string }) => {
        return {
          label: `${cardType.value}`,
          value: `${cardType.key}`,
        };
      }
    );
  }, [rawCardTypeList?.data]);

  const onSubmit = (formValues: CampaignAddFormValuesType) => {
    const req: ICampaignAddRequest = {
      merchantId: selectedMerchantId?.value,
      cardBins: selectedBins,
      bankCode: formValues.bankCode,
      cardType: formValues.cardType,
      discountRate: Number(formValues.discountRate),
      minAmount: Number(formValues.minAmount.replace(".", "").replace(",", "")),
      maxAmount: Number(formValues.maxAmount.replace(".", "").replace(",", "")),
      startDate: dayjs(formValues.startDate).format("YYYY-MM-DD"),
      endDate: dayjs(formValues.endDate).format("YYYY-MM-DD"),
    };

    CampaignAdd(req, {
      onSuccess(data) {
        if (data.isSuccess) {
          navigate("/campaign-management/campaign-listing");
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
  };

  const handleBinListChange = (event: any, selectedValues: any) => {
    setSelectedBins([]);
    let list: Array<string> = [];
    selectedValues.map((e: { label: string; value: string }) => {
      list.push(e.label);
    });
    setSelectedBins(list);
  };

  const handleBack = () => navigate("/dashboard");

  getValues();

  return (
    <Stack flex={1} justifyContent="space-between">
      <Stack flex={1} p={2}>
        <Stack spacing={4}>
          <Stack spacing={3} direction="row" width={isDesktop ? 800 : 'auto'}>
            <FormControl sx={{ width: isDesktop ? "50%" : '100%' }}>
              {merchantList && (
                <Controller
                  control={control}
                  name="merchantId"
                  render={() => {
                    return (
                      <>
                        <Autocomplete
                          sx={{ mr: isDesktop ? 2 : 0 }}
                          id="merchantId"
                          onChange={(event, selectedValue) => {
                            setValue("merchantId", selectedValue);
                          }}
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
          <Stack spacing={3} direction={isDesktop ? "row" : 'column'} width={isDesktop ? 800 : 'auto'}>
          <FormControl sx={{ flex: 1, width: isDesktop ? "50%" : "100%" }}>
  {acquirerBankList && (
    <Controller
      name="bankCode"
      control={control}
      defaultValue=""
      render={({ field: { onChange, value } }) => {
        const selectedBank = acquirerBankList.find(
          (option) => option.value === value
        );

        return (
          <Autocomplete
            id="bankCode"
            options={acquirerBankList}
            getOptionSelected={(option, value) => option.value === value}
            getOptionLabel={(option) => option.label}
            value={selectedBank || null}
            onChange={(_, newValue) => {
              onChange(newValue ? newValue.value : "");
            }}
            renderInput={(params) => (
              <TextField {...params} label="Banka" />
            )}
          />
        );
      }}
    />
  )}
</FormControl>

            <FormControl sx={{ flex: 1, width: isDesktop ? "50%" : '100%' }}>
              {cardBinList && (
                <Controller
                  control={control}
                  name="cardBins"
                  render={() => {
                    return (
                      <Autocomplete
                        multiple
                        id="cardBins"
                        options={cardBinList}
                        disableCloseOnSelect
                        getOptionLabel={(option: {
                          label: string;
                          value: string;
                        }) => option.label}
                        onChange={(event, selectedValue) => {
                          handleBinListChange(event, selectedValue);
                          setValue("cardBins", selectedValue);
                          getValues("cardBins");
                        }}
                        renderOption={(props, option, { selected }) => (
                          <li {...props}>
                            <Checkbox
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
                            label="Kart Bin"
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
          <Stack spacing={3} direction={isDesktop ? "row" : 'column'} width={isDesktop ? 800 : 'auto'}>
          <FormControl sx={{ flex: 1, width: isDesktop ? "50%" : "100%" }}>
  {cardTypeList && (
    <Controller
      name="cardType"
      control={control}
      defaultValue=""
      render={({ field: { onChange, value } }) => {
        const selectedCardType = cardTypeList.find(
          (option) => option.value === value
        );

        return (
          <Autocomplete
            id="cardType"
            options={cardTypeList}
            getOptionSelected={(option, value) => option.value === value}
            getOptionLabel={(option) => option.label}
            value={selectedCardType || null}
            onChange={(_, newValue) => {
              onChange(newValue ? newValue.value : "");
            }}
            renderInput={(params) => (
              <TextField {...params} label="Kart Tipi" />
            )}
          />
        );
      }}
    />
  )}
</FormControl>

            <FormControl sx={{ flex: 1 }}>
              <InputControl
                sx={{ flex: 1 }}
                adornmentText="%"
                label="İndirim Oranı"
                control={control}
                id="discountRate"
                numeric
              />
            </FormControl>
          </Stack>
          <Stack spacing={3} direction={isDesktop ? "row" : 'column'} width={isDesktop ? 800 : 'auto'}>
            <FormControl sx={{ flex: 1 }}>
              <NumericFormatInputControl
                sx={{ flex: 1 }}
                label="Minimum Tutar"
                control={control}
                id="minAmount"
                adornmentText="TL"
                thousandSeparator=","
                decimalSeparator="."
                decimalScale={2}
                fixedDecimalScale
              />
            </FormControl>
            <FormControl sx={{ flex: 1 }}>
              <NumericFormatInputControl
                sx={{ flex: 1 }}
                label="Maksimum Tutar"
                control={control}
                id="maxAmount"
                adornmentText="TL"
                thousandSeparator=","
                decimalSeparator="."
                decimalScale={2}
                fixedDecimalScale
              />
            </FormControl>
          </Stack>
          <Stack spacing={3} direction={isDesktop ? "row" : 'column'} width={isDesktop ? 800 : 'auto'}>
            <FormControl sx={{ flex: 1 }}>
              <DatePickerControl
                sx={{ flex: 1 }}
                id="startDate"
                control={control}
                label="Kampanya Başlangıç Tarihi"
                defaultValue={dayjs()}
              />
            </FormControl>
            <FormControl sx={{ flex: 1 }}>
              <DatePickerControl
                sx={{ flex: 1 }}
                id="endDate"
                control={control}
                label="Kampanya Bitiş Tarihi"
                defaultValue={dayjs()}
              />
            </FormControl>
          </Stack>
          <Stack direction={isDesktop ? "row" : 'column'} spacing={3} justifyContent="flex-end" width={isDesktop ? 800 : 'auto'}>
            {!!showCreate && (
              <Button
                onClick={handleSubmit(onSubmit)}
                variant="contained"
                text={"Kaydet"}
              />
            )} 
            <Button onClick={handleBack} sx={{ mx: 2 }} text={"Iptal"} />
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};
