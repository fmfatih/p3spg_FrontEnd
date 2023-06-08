// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/* eslint-disable jsx-a11y/anchor-is-valid */
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
  useGetMerchantVPosList,
  useGetMemberVPosList,
} from "../../../hooks";
import {
  GridColDef,
  GridActionsCellItem,
  GridValueFormatterParams,
  GridPaginationModel,
} from "@mui/x-data-grid";
import { default as dayjs } from "dayjs";
import React, { useEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Stack } from "@mui/system";
import {
  FormControl,
  Link,
  Box,
  useTheme,
  useMediaQuery,
  Autocomplete,
  TextField,
} from "@mui/material";
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
import { useUserInfo } from "../../../store/User.state";

export const PaymentAndTransactionFilter = () => {
  const theme = useTheme();
  const { showDelete, showUpdate } = useAuthorization();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const [userInfo] = useUserInfo();
  const { control, handleSubmit, setValue, getValues } =
    useForm<PaymentAndTransactionValuesType>({
      resolver: zodResolver(paymentAndTransactionFormSchema),
      defaultValues: paymentAndTransactionInitialValues,
    });
  const [tableData, setTableData] = useState<PagingResponse<Array<any>>>();
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: -1,
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
  const { mutate: getMemberVPosList, data: rawMemberVPosList } =
  useGetMemberVPosList();
  const { mutate: getMerchantVPosList, isLoading } = useGetMerchantVPosList();
  const setSnackbar = useSetSnackBar();

  useEffect(() => {
    setValue("startDate", dayjs().add(-1, "day"));
    setValue("endDate", dayjs());
  }, [setValue]);

  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [merchantBankList, setMerchantBankList] = useState([]);
  const [bankList, setBankList] = useState([]);
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
console.log(userInfo.merchantId);

  

  const payment3DTrxSettingsList = useMemo(() => {
    return rawPayment3DTrxSettingsList?.data?.filter((resourceType) => resourceType.status === "ACTIVE").map(
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


  useEffect(() => {
    if (userInfo.merchantId === 0) {
      getMemberVPosList({
        orderBy: "CreateDate",
        orderByDesc: true,
        status: "ACTIVE",
      }, {
        onSuccess: (data) => {
          const bankList = data?.data?.result?.map(
            (bank: { bankCode: string; bankName: string }) => {
              return {
                label: `${bank.bankName}`,
                value: bank.bankCode,
              };
            }
          );
          setBankList(bankList);
        }
      });
    } else {
      getMerchantVPosList(
        {
          size: paginationModel.pageSize,
          page: paginationModel.page,
          orderBy: "CreateDate",
          orderByDesc: true,
          status: "ACTIVE",
        },
        {
          
          onSuccess: (data) => {       
            const bankList = data?.data?.result
            .filter((bank: { merchantId: number }) => {
              return bank.merchantId === Number(userInfo.merchantId);
            })
              .map(
                (bank: { bankCode: string; bankName: string, merchantId: number }) => {
                  return {
                    label: `${bank.bankName}`,
                    value: bank.bankCode,
                  };
                }
              );
           
            setBankList(bankList);
  
          },
        }
      );
    }
  }, [getMerchantVPosList, getMemberVPosList, userInfo.merchantId]);
  


  

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

  // if (transaction.status !== "SUCCESS") {
  //   return <Box></Box>;
  // }

  // const isRefund = transaction.endOfDayFlag;
  // const buttonLabel = isRefund ? "İade" : "İptal";
  // const buttonColor = isRefund ? "#EEAB00" : "#F5004A";

  function RenderActionButton(transaction: any) {
    let buttonLabel = "";
    let buttonColor = "";
    const isRefund = transaction.endOfDayFlag;

    if (transaction.status === "SUCCESS" && transaction.txnType !== "REFUND") {
      buttonLabel = isRefund ? "İade" : "İptal";
      buttonColor = isRefund ? "#EEAB00" : "#F5004A";
    }

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
          GetPaymentAndTransaction({
            size: paginationModel.pageSize,
            page: paginationModel.page,
            orderBy: "CreateDate",
            orderByDesc: true,
            startDate: dayjs(getValues("startDate")).format(
              "YYYY-MM-DD HH:mm:ss"
            ),
            endDate: dayjs(getValues("endDate")).format("YYYY-MM-DD HH:mm:ss"),
            orderId: getValues("orderId"),
            cardNumber: getValues("cardNumber"),
            authCode: getValues("authCode"),
            status: getValues("status"),
            transactionType: getValues("transactionType"),
            bankCode: getValues("bankCode"),
          }, {
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
          GetPaymentAndTransaction({
            size: paginationModel.pageSize,
            page: paginationModel.page,
            orderBy: "CreateDate",
            orderByDesc: true,
            startDate: dayjs(getValues("startDate")).format(
              "YYYY-MM-DD HH:mm:ss"
            ),
            endDate: dayjs(getValues("endDate")).format("YYYY-MM-DD HH:mm:ss"),
            orderId: getValues("orderId"),
            cardNumber: getValues("cardNumber"),
            authCode: getValues("authCode"),
            status: getValues("status"),
            transactionType: getValues("transactionType"),
            bankCode: getValues("bankCode"),
          }, {
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
      { field: "merchantId", headerName: "Üye İşyeri Numarası", width: 180 },
      {
        field: "merchantName",
        headerName: "Üye İşyeri Adı",
        width: 300,
      },
      { field: "maskedPan", headerName: "Kart Numarası", width: 200 },
      {
        field: "orderId",
        headerName: "Sipariş Numarası",
        width: 400,
      },
      { field: "bankName", headerName: "Banka Adı", width: 300 },
      { field: "currencyDesc", headerName: "Para Birimi", width: 150 },
      { field: "statusDesc", headerName: "İşlem Durumu", width: 200 },
      { field: "systemDateFormatted", headerName: "İşlem Tarihi", width: 200 },
      { field: "webUrl", headerName: "WEB Url", width: 200 },
      { field: "installmentCount", headerName: "Taksit Sayısı", width: 200 },
  
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
        headerName: "Tutar",
        width: 200,
        valueFormatter: (params: GridValueFormatterParams<number>) => {
          if (params.value == null) {
            return "";
          }
          return `${params.value} TL`;
        },
      },
      {
        field: "totalComission",
        headerName: "Komisyon Tutar",
        width: 200,
        valueFormatter: (params: GridValueFormatterParams<number>) => {
          if (params.value == null) {
            return "";
          }
          return `${params.value} TL`;
        },
      },
      { field: "txnTypeDesc", headerName: "İşlem Tipi", width: 150 },
      { field: "paymentModel", headerName: "Ödeme Tipi", width: 200 },
      { field: "requestIp", headerName: "İstek IP", width: 200 },
      { field: "description", headerName: "Açıklama", width: 200 },
      { field: "currency", headerName: "Para Birimi Kodu", width: 200 },
      { field: "cardHolderName", headerName: "İşlem Yapılan Kart Bilgisi", width: 200 },
      { field: "failUrl", headerName: "Başarısız İşleme Ait URL", width: 200 },
      { field: "okUrl", headerName: "Başarılı İşleme Ait URL", width: 200 },
      { field: "bankblocked", headerName: "Banka Blokesi", width: 200,  valueFormatter: (params) => params.value ? "Evet" : "Hayır",},
      { field: "bankblockedday", headerName: "Banka Bloke Günü", width: 200 },
      { field: "bankcommission", headerName: "Banka Komisyonu", width: 200 },
      { field: "merchantblocked", headerName: "Üye İşyeri Blokesi", width: 200,valueFormatter: (params) => params.value ? "Evet" : "Hayır", },
      { field: "merchantblockedday", headerName: "Üye İşyeri Bloke Günü", width: 200 },
      {
        field: "merchantcommision",
        headerName: "Üye İşyeri Komisyonu",
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
        headerName: "Üye İşyeri Sabit Komisyonu",
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
        headerName: "Müşteri Komisyonu",
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
        headerName: "Müşteri Sabit Komisyonu",
        width: 200,
        valueFormatter: (params: GridValueFormatterParams<number>) => {
          if (params.value == null) {
            return "";
          }
          return `${params.value} TL`;
        },
      },

      { field: "cardType", headerName: "Kart Tipi", width: 200 },
      { field: "cardTypeDesc", headerName: "Kart Tipi Açıklama", width: 200 },
      { field: "authCode", headerName: "Otorizasyon Kodu", width: 200 },
      { field: "endOfDayFlag", headerName: "Gün Sonu", width: 200 , valueFormatter: (params) => params.value ? "Evet" : "Hayır", },
      { field: "endOfDayId", headerName: "Gün Sonu ID", width: 200 },
      { field: "endOfDayDate", headerName: "Gün Sonu Tarihi", width: 200 },
      { field: "cardBankCode", headerName: "Kartın Banka Kodu", width: 200 },
      { field: "cardBankName", headerName: "Kartın Banka Adı", width: 200 },
      { field: "responseCode", headerName: "Cevap Kodu", width: 200 },
      { field: "bankResponseCode", headerName: "Banka Cevap Kodu", width: 200 },
      { field: "responseMessage", headerName: "Cevap Açıklaması", width: 200 },
      { field: "systemDateFormatted", headerName: "Sistem Tarihi", width: 200 },
      { field: "createDateFormatted", headerName: "İşlemin Başlama Tarihi", width: 200 },
      { field: "updateDateFormatted", headerName: "İşlem Bitiş Tarihi", width: 200 },
      { field: "id", headerName: "ID", width: 200 },
      { field: "systemDate", headerName: "Sistem Tarihi", width: 200 },
      { field: "createDate", headerName: "Oluşturma Tarihi", width: 200 },
      // { field: "createUserId", headerName: "Oluşturan Kullanıcı ID", width: 200 },
      // { field: "createUserName", headerName: "Oluşturan Kullanıcı Adı Soyadı", width: 200 },
      // { field: "updateDate", headerName: "Güncelleme Tarihi", width: 200 },
      // { field: "updateUserId", headerName: "Güncelleme Kullanıcı ID", width: 200 },
      // { field: "updateUserName", headerName: "Güncelleyen Kullanıcı Adı Soyadı", width: 200 },

      // { field: "deleteDate", headerName: "Silme Tarihi", width: 200 },
      // { field: "deleteUserId", headerName: "Silinen Kullanıcı ID", width: 200 },
      // { field: "deleteUserName", headerName: "Silinen Kullanıcı Adı Soyadı", width: 200 },

  
    
     

      // { field: "cardHolderName", headerName: "Kart Sahibi", width: 200 },

      // { field: "merchantVkn", headerName: "Üye İşyeri VKN", width: 180 },
  
  
      // {
      //   field: "updateDateFormatted",
      //   headerName: "İşlemin Gerçekleşme Zamanı",
      //   width: 250,
      // },

   
    

     

  

  
 
 
  
      // { field: "cardTypeDesc", headerName: "Kart Tipi", width: 200 },

   
 
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
              width={isDesktop ? "100%" : "auto"}
              maxWidth={1308}
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
                {transactionStatusList && (
                  <Controller
                    name="status"
                    control={control}
                    defaultValue=""
                    render={({ field: { onChange, value } }) => {
                      const selectedStatus = transactionStatusList.find(
                        (option) => option.value === value
                      );

                      return (
                        <Autocomplete
                          id="status"
                          options={transactionStatusList}
                          getOptionSelected={(option, value) =>
                            option.value === value
                          }
                          getOptionLabel={(option) => option.label}
                          value={selectedStatus || null}
                          onChange={(_, newValue) => {
                            onChange(newValue ? newValue.value : "");
                          }}
                          renderInput={(params) => (
                            <TextField {...params} label="İşlem Durumu" />
                          )}
                        />
                      );
                    }}
                  />
                )}
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
              width={isDesktop ? "100%" : "auto"}
                maxWidth={1308}
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
                {payment3DTrxSettingsList && (
                  <Controller
                    name="transactionType"
                    control={control}
                    defaultValue=""
                    render={({ field: { onChange, value } }) => {
                      const selectedTransactionType =
                        payment3DTrxSettingsList.find(
                          (option) => option.value === value
                        );

                      return (
                        <Autocomplete
                          id="transactionType"
                          options={payment3DTrxSettingsList}
                          getOptionSelected={(option, value) =>
                            option.value === value
                          }
                          getOptionLabel={(option) => option.label}
                          value={selectedTransactionType || null}
                          onChange={(_, newValue) => {
                            onChange(newValue ? newValue.value : "");
                          }}
                          renderInput={(params) => (
                            <TextField {...params} label="İşlem Tipi" />
                          )}
                        />
                      );
                    }}
                  />
                )}
              </FormControl>

              <FormControl sx={{ flex: 1 }}>
                {bankList && (
                  <Controller
                    name="bankCode"
                    control={control}
                    defaultValue=""
                    render={({ field: { onChange, value } }) => {
                      const selectedBank = bankList.find(
                        (option) => option.value === value
                      );

                      return (
                        <Autocomplete
                          id="bankCode"
                          options={bankList}
                          getOptionSelected={(option, value) =>
                            option.value === value
                          }
                          getOptionLabel={(option) => option.label}
                          value={selectedBank || null}
                          onChange={(_, newValue) => {
                            onChange(newValue ? newValue.value : "");
                          }}
                          renderInput={(params) => (
                            <TextField {...params} label="POS Bankası" />
                          )}
                        />
                      );
                    }}
                  />
                )}
              </FormControl>
            </Stack>
            <Stack
              direction="row"
              justifyContent="flex-end"
              width={isDesktop ? "100%" : "auto"}
              maxWidth={1308}
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
