// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/* eslint-disable jsx-a11y/anchor-is-valid */
import {
  merchantPaymentFormSchema,
  MerchantPaymentValuesType,
  merchantPaymentInitialValues,
} from "./_formTypes";
import {
  useGetPayment3DTrxSettingsList,
  useGetAcquirerBankList,
  GetMerchantPaymentRequest,
  useGetMerchantPayment,
  useCancelPaymentAndTransaction,
  CancelPaymentAndTransactionRequest,
  useRefundPaymentAndTransaction,
  RefundPaymentAndTransactionRequest,
  useGetTrxStatusSettingsList,
  BasePagingResponse,
  PagingResponse,
  useAuthorization,
  useGetAllMerchantList,
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
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { Button, Loading } from "../../atoms";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  DateTimePickerControl,
  Table,
  DeleteConfirmModal,
  NumericFormatInputControl,
  MechantPaymentModal,
  DatePickerControl,
} from "../../molecules";
import { useSetSnackBar } from "../../../store/Snackbar.state";
import { downloadExcel } from "../../../util/downloadExcel";
import { useUserInfo } from "../../../store/User.state";
import { useLocation, useNavigate } from "react-router-dom";

export const MerchantEndOfDayComponent = () => {
  const theme = useTheme();
  const user = useLocation().state as unknown as IUser | undefined;
  const { showDelete, showUpdate } = useAuthorization();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const { control, handleSubmit, setValue, getValues } =
    useForm<MerchantPaymentValuesType>({
      resolver: zodResolver(merchantPaymentFormSchema),
      defaultValues: merchantPaymentInitialValues,
    });
  const [tableData, setTableData] = useState<PagingResponse<Array<any>>>();
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 10,
  });
  const [tableselectedRow, setTableSelectedRow] = useState({} as any);
  const { mutate: GetMerchantPayment, isLoading: isGetMerchantPaymentLoading } =
    useGetMerchantPayment();

  const setSnackbar = useSetSnackBar();
  const { data: rawMerchantList } = useGetAllMerchantList();
  const [userInfo] = useUserInfo();
  useEffect(() => {
    setValue("startDate", dayjs().add(-1, "day"));
    setValue("endDate", dayjs());
  }, [setValue]);

  const [selectedMerchant, setSelectedMerchant] = useState(
    user
      ? Number(userInfo.merchantId) !== 0
        ? { label: userInfo.merchantName, value: Number(userInfo.merchantId) }
        : null
      : null
  );

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

  const onSubmit = (data: MerchantPaymentValuesType) => {
    setTableData(undefined);
    const req: GetMerchantPaymentRequest = {
      page: paginationModel.page,
      size: paginationModel.pageSize,
      orderByDesc: true, // Sipariş sırası
      orderBy: "CreateDate", // Siparişe göre
      status: data.status, // Durum
      merchantId: data.merchantId, // Üye işyeri ID
      date: data?.date ? dayjs(data.date).format("YYYY-MM-DD") : "", // Tarih
      paymentFlag: data.paymentFlag // Ödeme durumu
    };

    GetMerchantPayment(req, {
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
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => {
      setIsModalOpen(true);
    };
  
    const handleCloseModal = () => {
      setIsModalOpen(false);
    };
    return (
      <>
      <Button
        variant="contained"
        color="primary"
        onClick={handleOpenModal}
        text="Detay"
        sx={{flex:1,height:20,py:4}}
      >
      </Button>
      <MechantPaymentModal  transaction={transaction}  isOpen={isModalOpen} handleClose={handleCloseModal} />
    </>
    );
  }



  const deleteRow = React.useCallback(
    (transaction: any) => () => {
      setTableSelectedRow(transaction);
    },
    []
  );
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
      { field: "endOfDayDate", headerName: "Gün Sonu Tarihi", width: 200 },
      {
        field: "merchantCommissionAmount",
        headerName: "Üye İşyeri Komisyon Tutarı",
        width: 200,
      },
      {
        field: "paymentAmountFlag",
        headerName: "Gün Sonu Yapıldı mı?",
        width: 200,
      },
      {
        field: "paymentAmount",
        headerName: "Hak Ediş Tutarı",
        width: 200,
        valueFormatter: (params: GridValueFormatterParams<number>) => {
          if (params.value == null) {
            return "";
          }
          return `${params.value} TL`;
        },
      },
      { field: "iban", headerName: "İban", width: 300 },
    ];
  }, [deleteRow, showDelete]);

  const handleChangePagination = (model: GridPaginationModel) => {
    setPaginationModel(model);
    const req: GetMerchantPaymentRequest = {
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

    GetMerchantPayment(req, {
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
    GetMerchantPayment(
      {
        page: 0,
        size: -1,
        orderBy: "CreateDate",
        orderByDesc: true,
        date: dayjs(getValues("date")).format("YYYY-MM-DD"),
  
      },
      {
        onSuccess: (data) => {
          if (data.isSuccess) {
            downloadExcel(data?.data?.result || [], "İşyeri Hak Ediş Raporları");
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
    isGetMerchantPaymentLoading 
  
  return (
    <>
      {hasLoading && <Loading />}
      <Stack flex={1} justifyContent="space-between">
        <Stack flex={1} p={2}>
          <Stack spacing={4}>
            <Stack
              spacing={5}
              direction={isDesktop ? "row" : "column"}
              width={isDesktop ? 800 : "auto"}
            >
              <FormControl sx={{ flex: isDesktop ? 1 : "auto" }}>

              <DatePickerControl
                  sx={{ flex:1,ml:isDesktop?0:0}}
                  id="date"
                  control={control}
                  label="Gün Sonu tarihi"
                  defaultValue={dayjs()}
                />
              </FormControl>

              <Box flex={1}>
                <Controller
                  name="paymentFlag"
                  control={control}
                  sx={{ flex: 1 }}
                  // defaultValue={user?.status || "ACTIVE"}
                  render={({ field: { onChange, value } }) => (
                    <FormControl component="fieldset">
                      <FormLabel component="legend">
                        Ödeme Yapıldı mı?
                      </FormLabel>
                      <RadioGroup
                        aria-label="paymentFlag"
                        name="paymentFlag"
                        value={value}
                        onChange={(e) => onChange(e.target.value === "true")}
                        row
                      >
                        <FormControlLabel
                          value="true"
                          control={<Radio />}
                          label="Evet"
                        />
                        <FormControlLabel
                          value="false"
                          control={<Radio />}
                          label="Hayır"
                        />
                      </RadioGroup>
                    </FormControl>
                  )}
                />
              </Box>
            </Stack>
            <Stack
              spacing={3}
              direction={isDesktop ? "row" : "column"}
              width={isDesktop ? 800 : "auto"}
            >
              <FormControl sx={{ width: isDesktop ? "50%" : "100%" }}>
                {merchantList && (
                  <Controller
                    control={control}
                    name="merchantId"
                    render={({ field, fieldState }) => {
                      return (
                        <>
                          <Autocomplete
                            sx={{ mr:isDesktop? 2:0 }}
                            onChange={(event, selectedValue) => {
                              setSelectedMerchant(selectedValue);
                              setValue("merchantId", selectedValue?.value || 0);
                              field.onChange(selectedValue?.value || 0);
                            }}
                            id="merchantId"
                            options={merchantList}
                            defaultValue={user?.id ? selectedMerchant : null}
                            getOptionLabel={(option: {
                              label: string;
                              value: number;
                            }) => option.label}
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
            
            </Stack>

            <Stack
              direction="row"
              justifyContent="flex-end"
              width={isDesktop ? 700 : "auto"}
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
                  // getRowId={(row) => row.merchantId}
                  autoHeight={!isDesktop}
                  columns={columns}
                  exportFileName="İşyeri Hak Ediş Raporları"
                  onSave={() => onSave()}
                />
              </>
            )}
          </Stack>
        </Stack>
      </Stack>
    </>
  );
};
