import {
  INonsecure,
  useAddNonsecure,
  useUpdateNonsecure,
  useGetAcquirerBankList,
  useGetAllMerchantList,
} from "../../../hooks";
import { Box, Stack, FormControl } from "@mui/material";
import {
  BaseModal,
  BaseModalProps,
  SelectControl,
  SwitchControl,
  InputControl,
} from "../../molecules";
import { useEffect, useMemo, useState } from "react";
import { Button, Loading } from "../../atoms";
import { useForm } from "react-hook-form";
import { useSetSnackBar } from "../../../store/Snackbar.state";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  nonsecureAddFormSchema,
  NonsecureAddFormSchemaFormValuesType,
  nonsecureAddInitialValues,
} from "./_formTypes";

export type NonsecureAddModalProps = BaseModalProps & {
  title?: string;
  nonsecureData?: INonsecure;
};

export const NonsecureAddModal = ({
  onClose,
  nonsecureData,
  isOpen,
  title = "Non Secure Tanımlama",
}: NonsecureAddModalProps) => {
  const { control, reset, handleSubmit } =
    useForm<NonsecureAddFormSchemaFormValuesType>({
      resolver: zodResolver(nonsecureAddFormSchema),
      defaultValues: nonsecureAddInitialValues,
    });
  const { data: rawAcquirerBankList } = useGetAcquirerBankList();
  const { data: rawMerchantList } = useGetAllMerchantList();
  const { mutate: addParameter, isLoading } = useAddNonsecure();
  const { mutate: updateParameter, isLoading: isUpdateLoading } =
    useUpdateNonsecure();

  const setSnackbar = useSetSnackBar();

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
  const onSubmit = (data: any) => {
    if (nonsecureData && nonsecureData?.id > 0) {
      updateParameter(
        { ...data, id: nonsecureData.id },
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
      addParameter(data, {
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
    if (!!nonsecureData && JSON.stringify(nonsecureData) !== "{}") {
      reset({
        merchantId: nonsecureData?.merchantId,
        bankCode: nonsecureData?.bankCode,
        threeDRequired: nonsecureData?.threeDRequired,
        maxAmount: nonsecureData?.maxAmount,
      });
    }
  }, [reset, nonsecureData]);

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
              <FormControl sx={{ flex: 1 }}>
                {merchantList && (
                  <SelectControl
                    id="merchantId"
                    control={control}
                    label="Üye İşyeri"
                    items={merchantList}
                  />
                )}
              </FormControl>
              <FormControl sx={{ flex: 1 }}>
                {acquirerBankList && (
                  <SelectControl
                    id="bankCode"
                    control={control}
                    label="Banka"
                    items={acquirerBankList}
                  />
                )}
              </FormControl>
            </Stack>
            <Stack alignItems="center" direction="row" spacing={2}>
              <FormControl sx={{ flex: 1 }}>
                <SwitchControl
                  defaultValue={false}
                  label="Nonsecure işlem yapılsın"
                  control={control}
                  id="threeDRequired"
                />
              </FormControl>
              <FormControl sx={{ flex: 1 }}>
                <InputControl
                  sx={{ flex: 1 }}
                  adornmentText="TL"
                  label="Maksimum Tutar"
                  control={control}
                  id="maxAmount"
                  numeric
                />
              </FormControl>
            </Stack>
          </Stack>
          {/* !!! --- Button --- !!! */}
          <Stack justifyContent="flex-end" alignItems="center" direction="row">
            <Button
              variant="contained"
              text={nonsecureData ? "Güncelle" : "Ekle"}
              onClick={handleSubmit(onSubmit)}
            />
          </Stack>
        </Stack>
      </BaseModal>
    </>
  );
};
