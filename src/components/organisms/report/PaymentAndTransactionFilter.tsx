import {
  paymentAndTransactionFormSchema,
  PaymentAndTransactionValuesType,
  paymentAndTransactionInitialValues,
} from "./_formTypes";
import {
  useGetPayment3DTrxSettingsList,
  useGetAcquirerBankList,
  GetPaymentAndTransactionRequest,
  useGetPaymentAndTransaction,
  useCancelPaymentAndTransaction,
  CancelPaymentAndTransactionRequest,
  useRefundPaymentAndTransaction,
  RefundPaymentAndTransactionRequest,
  useGetTrxStatusSettingsList,
  BasePagingResponse,
  PagingResponse,
  useAuthorization,
} from "../../../hooks";
import {
  GridColDef,
  GridActionsCellItem,
  GridValueFormatterParams,
  GridPaginationModel,
} from "@mui/x-data-grid";
import { default as dayjs } from "dayjs";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Stack } from "@mui/system";
import { FormControl, Link, Box, useTheme, useMediaQuery } from "@mui/material";
import { Button, Loading } from "../../atoms";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  DateTimePickerControl,
  SelectControl,
  InputControl,
  Table,
  DeleteConfirmModal,
  NumericFormatInputControl,
} from "../../molecules";
import { useSetSnackBar } from "../../../store/Snackbar.state";
import { downloadExcel } from "../../../util/downloadExcel";

export const PaymentAndTransactionFilter = () => {
  const theme = useTheme();
  const { showDelete, showUpdate } = useAuthorization();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const { control, handleSubmit, setValue, getValues } =
    useForm<PaymentAndTransactionValuesType>({
      resolver: zodResolver(paymentAndTransactionFormSchema),
      defaultValues: paymentAndTransactionInitialValues,
    });
  const [tableData, setTableData] = useState<PagingResponse<Array<any>>>();
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 25,
  });
  const [tableselectedRow, setTableSelectedRow] = useState({} as any);
  const {
    mutate: GetPaymentAndTransaction,
    isLoading: isGetPaymentAndTransactionLoading,
  } = useGetPaymentAndTransaction();
  const {
    mutate: CancelPaymentAndTransaction,
    isLoading: isCancelPaymentAndTransactionLoading,
  } = useCancelPaymentAndTransaction();
  const {
    mutate: RefundPaymentAndTransaction,
    isLoading: isRefundPaymentAndTransactionLoading,
  } = useRefundPaymentAndTransaction();
  const { data: rawTransactionStatusList } = useGetTrxStatusSettingsList({});
  const { data: rawPayment3DTrxSettingsList } = useGetPayment3DTrxSettingsList(
    {}
  );
  const { data: rawAcquirerBankList } = useGetAcquirerBankList();
  const setSnackbar = useSetSnackBar();

  useEffect(() => {
    setValue("startDate", dayjs().add(-1, "day"));
    setValue("endDate", dayjs());
  }, [setValue]);

  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);

  const transactionStatusList = useMemo(() => {
    return rawTransactionStatusList?.data?.map(
      (resourceType: { value: string; key: string }) => {
        return {
          label: resourceType.value,
          value: `${resourceType.key}`,
        };
      }
    );
  }, [rawTransactionStatusList?.data]);

  const payment3DTrxSettingsList = useMemo(() => {
    return rawPayment3DTrxSettingsList?.data?.map(
      (resourceType: { value: string; key: string }) => {
        return {
          label: resourceType.value,
          value: `${resourceType.key}`,
        };
      }
    );
  }, [rawPayment3DTrxSettingsList?.data]);

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

  const onSubmit = (data: PaymentAndTransactionValuesType) => {
    setTableData(undefined);
    const req: GetPaymentAndTransactionRequest = {
      startDate: data?.startDate
        ? dayjs(data.startDate).format("YYYY-MM-DD HH:mm:ss")
        : "",
      endDate: data.endDate
        ? dayjs(data.endDate).format("YYYY-MM-DD HH:mm:ss")
        : "",
      orderId: data.orderId,
      cardNumber: data.cardNumber,
      authCode: data.authCode,
      status: data.status,
      transactionType: data.transactionType,
      bankCode: data.bankCode,
      size: paginationModel.pageSize,
      page: paginationModel.page,
      orderBy: "CreateDate",
    };

    GetPaymentAndTransaction(req, {
      onSuccess: (data) => {
        if (data.isSuccess) {
          setTableData(data.data);
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
  };

  function RenderActionButton(transaction: any) {
    if (transaction.status !== "SUCCESS") {
      return <Box></Box>;
    }

    const isRefund = transaction.endOfDayFlag;
    const buttonLabel = isRefund ? "İade" : "İptal";
    const buttonColor = isRefund ? "#EEAB00" : "#F5004A";

    return (
      <>
        <Link
          component="button"
          variant="body2"
          sx={{ color: buttonColor }}
          onClick={() => {
            setTableSelectedRow(transaction);
            isRefund ? setIsRefundModalOpen(true) : setIsCancelModalOpen(true);
          }}
        >
          {buttonLabel}
        </Link>
      </>
    );
  }

  const handleCloseCancelModal = () => {
    setIsCancelModalOpen(false);
  };

  const handleCloseRefundModal = () => {
    setIsRefundModalOpen(false);
    setValue("refundAmount", "");
  };

  const deleteRow = React.useCallback(
    (transaction: any) => () => {
      setTableSelectedRow(transaction);
    },
    []
  );
  const handleCancelConfirm = () => {
    const req: CancelPaymentAndTransactionRequest = {
      merchantId: tableselectedRow?.merchantId || 0,
      orderId: tableselectedRow?.orderId || "",
      description: "",
    };
    CancelPaymentAndTransaction(req, {
      onSuccess: (data: any) => {
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
    });

    handleCloseCancelModal();
  };

  const handleRefundConfirm = () => {
    const req: RefundPaymentAndTransactionRequest = {
      merchantId: tableselectedRow?.merchantId || 0,
      orderId: tableselectedRow?.orderId || "",
      description: "",
      refundAmount:
        Number(getValues("refundAmount").replace(".", "").replace(",", "")) ||
        0,
    };
    RefundPaymentAndTransaction(req, {
      onSuccess: (data: any) => {
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
    });

    handleCloseRefundModal();
  };

  const columns: GridColDef[] = useMemo(() => {
    return [
      {
        field: "Aksiyonlar",
        type: "actions",
        width: 80,
        getActions: (params) => [
          !!showDelete ? (
            <GridActionsCellItem
              label="Sil"
              onClick={deleteRow(params.row)}
              icon={RenderActionButton(params.row)}
            />
          ) : (
            <></>
          ),
        ],
      },
      { field: "txnType", headerName: "İşlem Tipi", width: 150 },
      { field: "status", headerName: "İşlem Durumu", width: 200 },
      { field: "maskedPan", headerName: "Kart Numarası", width: 200 },
      { field: "cardBankCode", headerName: "Kartın Banka Kodu", width: 200 },
      { field: "cardBankName", headerName: "Kartın Bankası", width: 200 },
      { field: "cardHolderName", headerName: "Kart Sahibi", width: 200 },
      { field: "merchantId", headerName: "Üye İşyeri Numarası", width: 180 },
      { field: "merchantVkn", headerName: "Üye İşyeri VKN", width: 180 },
      {
        field: "merchantName",
        headerName: "Üye İşyeri Adı",
        width: 300,
      },
      { field: "systemDateFormatted", headerName: "İşlem Zamanı", width: 200 },
      {
        field: "updateDateFormatted",
        headerName: "İşlemin Gerçekleşme Zamanı",
        width: 250,
      },
      { field: "authCode", headerName: "Otorizasyon Kodu", width: 200 },
      { field: "bankName", headerName: "Banka Adı", width: 300 },
      { field: "bankResponseCode", headerName: "Banka Cevap Kodu", width: 200 },
      { field: "ResponseMessage", headerName: "Cevap Mesajı", width: 200 },
      { field: "installmentCount", headerName: "Taksit Sayısı", width: 200 },
      { field: "currencyDesc", headerName: "Para Birimi", width: 150 },
      {
        field: "totalAmount",
        headerName: "Toplam Tutar",
        width: 200,
        valueFormatter: (params: GridValueFormatterParams<number>) => {
          if (params.value == null) {
            return "";
          }
          return `${params.value} TL`;
        },
      },
      {
        field: "amount",
        headerName: "İşlem Tutarı",
        width: 200,
        valueFormatter: (params: GridValueFormatterParams<number>) => {
          if (params.value == null) {
            return "";
          }
          return `${params.value} TL`;
        },
      },
      {
        field: "merchantcommision",
        headerName: "Üye İşyeri Kom. Oranı",
        width: 200,
        valueFormatter: (params: GridValueFormatterParams<number>) => {
          if (params.value == null) {
            return "";
          }
          return `${params.value} %`;
        },
      },
      {
        field: "merchantadditionalcommision",
        headerName: "Üye İşyeri Kom. Tutarı",
        width: 200,
        valueFormatter: (params: GridValueFormatterParams<number>) => {
          if (params.value == null) {
            return "";
          }
          return `${params.value} TL`;
        },
      },
      {
        field: "customercommission",
        headerName: "Müşteri Kom. Oranı",
        width: 200,
        valueFormatter: (params: GridValueFormatterParams<number>) => {
          if (params.value == null) {
            return "";
          }
          return `${params.value} %`;
        },
      },
      {
        field: "customeradditionalcommission",
        headerName: "Müş. Kom. Tutarı",
        width: 200,
        valueFormatter: (params: GridValueFormatterParams<number>) => {
          if (params.value == null) {
            return "";
          }
          return `${params.value} TL`;
        },
      },
      {
        field: "orderId",
        headerName: "Sipariş Numarası",
        width: 400,
      },
      { field: "cardTypeDesc", headerName: "Kart Tipi", width: 200 },

      { field: "paymentModel", headerName: "Ödeme Modeli", width: 200 },
      { field: "endOfDayFlag", headerName: "Gün Sonu", width: 200 },
    ];
  }, [deleteRow, showDelete]);

  const handleChangePagination = (model: GridPaginationModel) => {
    setPaginationModel(model);
    const req: GetPaymentAndTransactionRequest = {
      startDate: getValues("startDate")
        ? dayjs(getValues("startDate")).format("YYYY-MM-DD HH:mm:ss")
        : "",
      endDate: getValues("endDate")
        ? dayjs(getValues("endDate")).format("YYYY-MM-DD HH:mm:ss")
        : "",
      orderId: getValues("orderId"),
      cardNumber: getValues("cardNumber"),
      authCode: getValues("authCode"),
      status: getValues("status"),
      transactionType: getValues("transactionType"),
      bankCode: getValues("bankCode"),
      size: paginationModel.pageSize,
      page: paginationModel.page,
      orderBy: "CreateDate",
    };

    GetPaymentAndTransaction(req, {
      onSuccess: (data) => {
        if (data.isSuccess) {
          setTableData(data.data);
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
  };

  const onSave = () => {
    GetPaymentAndTransaction(
      {
        size: -1,
        page: 0,
        orderBy: "CreateDate",
        orderByDesc: true,
        startDate: dayjs(getValues("startDate")).format("YYYY-MM-DD HH:mm:ss"),
        endDate: dayjs(getValues("endDate")).format("YYYY-MM-DD HH:mm:ss"),
      },
      {
        onSuccess: (data) => {
          if (data.isSuccess) {
            downloadExcel(data?.data?.result || [], "Ödeme ve İslem Raporu");
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

  const hasLoading =
    isGetPaymentAndTransactionLoading ||
    isCancelPaymentAndTransactionLoading ||
    isRefundPaymentAndTransactionLoading;
  return (
    <>
      {hasLoading && <Loading />}
      <Stack flex={1} justifyContent="space-between">
        <Stack flex={1} p={2}>
          <Stack spacing={4}>
            <Stack
              spacing={3}
              direction={isDesktop ? "row" : "column"}
              width={isDesktop ? 1308 : "auto"}
            >
              <FormControl sx={{ flex: isDesktop ? 1 : "auto" }}>
                <DateTimePickerControl
                  sx={{ flex: 1 }}
                  id="startDate"
                  control={control}
                  label="Başlangıç Tarihi"
                  defaultValue={dayjs().add(-1, "day")}
                />
              </FormControl>
              <FormControl sx={{ flex: isDesktop ? 1 : "auto" }}>
                <DateTimePickerControl
                  sx={{ flex: 1 }}
                  id="endDate"
                  control={control}
                  label="Bitiş Tarihi"
                  defaultValue={dayjs()}
                />
              </FormControl>
              <FormControl sx={{ flex: isDesktop ? 1 : "auto" }}>
                {transactionStatusList ? (
                  <SelectControl
                    id="status"
                    control={control}
                    label="İşlem Durumu"
                    items={transactionStatusList}
                  />
                ) : null}
              </FormControl>
              <FormControl sx={{ flex: isDesktop ? 1 : "auto" }}>
                <InputControl
                  label="Sipariş Numarası"
                  control={control}
                  id="orderId"
                />
              </FormControl>
            </Stack>
            <Stack
              spacing={3}
              direction={isDesktop ? "row" : "column"}
              width={isDesktop ? 1308 : "auto"}
            >
              <FormControl sx={{ flex: 1 }}>
                <InputControl
                  label="Kart Numarası"
                  control={control}
                  id="cardNumber"
                />
              </FormControl>
              <FormControl sx={{ flex: 1 }}>
                <InputControl
                  label="Otorizasyon Kodu"
                  control={control}
                  id="authCode"
                />
              </FormControl>
              <FormControl sx={{ flex: 1 }}>
                {payment3DTrxSettingsList ? (
                  <SelectControl
                    id="transactionType"
                    control={control}
                    label="İşlem Tipi"
                    items={payment3DTrxSettingsList}
                  />
                ) : null}
              </FormControl>
              <FormControl sx={{ flex: 1 }}>
                {acquirerBankList ? (
                  <SelectControl
                    id="bankCode"
                    control={control}
                    label="POS Bankası"
                    items={acquirerBankList}
                  />
                ) : null}
              </FormControl>
            </Stack>
            <Stack
              direction="row"
              justifyContent="flex-end"
              width={isDesktop ? 1308 : "auto"}
            >
              <Button
                onClick={handleSubmit(onSubmit)}
                variant="contained"
                text={"ARA"}
              />
            </Stack>
          </Stack>
          <Stack flex={1} mt={2}>
            {tableData?.result && (
              <>
                <Table
                  paginationModel={paginationModel}
                  onPaginationModelChange={handleChangePagination}
                  paginationMode="server"
                  rowCount={tableData.totalItems}
                  sx={{ width: isDesktop ? 1308 : window.innerWidth - 50 }}
                  isRowSelectable={() => false}
                  disableColumnMenu
                  rows={tableData.result}
                  autoHeight={!isDesktop}
                  columns={columns}
                  exportFileName="Ödeme ve İslem Raporu"
                  onSave={() => onSave()}
                />
                <DeleteConfirmModal
                  isOpen={isCancelModalOpen}
                  onClose={handleCloseCancelModal}
                  title="İptal Onayı"
                  content="Seçili kaydı iptal etmek istiyor musunuz?"
                  confirmButtonText="Evet"
                  closeButtonText="Hayır"
                  onConfirm={() => handleCancelConfirm()}
                ></DeleteConfirmModal>

                <DeleteConfirmModal
                  isOpen={isRefundModalOpen}
                  onClose={handleCloseRefundModal}
                  title="İade Onayı"
                  content="Seçili kaydı iade etmek istiyor musunuz?"
                  confirmButtonText="Evet"
                  closeButtonText="Hayır"
                  onConfirm={() => handleRefundConfirm()}
                >
                  <FormControl sx={{ width: 290, mt: 3 }}>
                    <NumericFormatInputControl
                      sx={{ flex: 1 }}
                      label="İade Tutarı"
                      control={control}
                      id="refundAmount"
                      adornmentText="TL"
                      thousandSeparator=","
                      decimalSeparator="."
                      decimalScale={2}
                      fixedDecimalScale
                    />
                  </FormControl>
                </DeleteConfirmModal>
              </>
            )}
          </Stack>
        </Stack>
      </Stack>
    </>
  );
};
