// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/* eslint-disable jsx-a11y/anchor-is-valid */
import {
  bankPaymentFormSchema,
  BankPaymentValuesType,
  bankPaymentInitialValues,
} from "./_formTypes";
import {
  GetBankPaymentRequest,
  useGetBankPayment,
  useCancelPaymentAndTransaction,
  CancelPaymentAndTransactionRequest,
  useRefundPaymentAndTransaction,
  RefundPaymentAndTransactionRequest,
  PagingResponse,
  useAuthorization,
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
  BankPaymentModal,
  DatePickerControl,
  DateTimePickerControl,
  Table,
} from "../../molecules";
import { useSetSnackBar } from "../../../store/Snackbar.state";
import { downloadExcel } from "../../../util/downloadExcel";
import { useUserInfo } from "../../../store/User.state";
import { useLocation, useNavigate } from "react-router-dom";

export const BankPaymentComponent = () => {
  const theme = useTheme();
  const user = useLocation().state as unknown as IUser | undefined;
  const { showDelete, showUpdate } = useAuthorization();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const { control, handleSubmit, setValue, getValues } =
    useForm<BankPaymentValuesType>({
      resolver: zodResolver(bankPaymentFormSchema),
      defaultValues: bankPaymentInitialValues,
    });
  const [tableData, setTableData] = useState<PagingResponse<Array<any>>>();
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 25,
  });
  const [tableselectedRow, setTableSelectedRow] = useState({} as any);
  const { mutate: GetBankPayment, isLoading: isGetBankPaymentLoading } =
    useGetBankPayment();

  const { mutate: getMemberVPosList, data: rawMemberVPosList } =
  useGetMemberVPosList();

  
  const [selectedMerchantVPosBankCode, setSelectedMerchantVPosBankCode] =
    useState(null as any);

  const setSnackbar = useSetSnackBar();

  const [userInfo] = useUserInfo();
  useEffect(() => {
    setValue("startDate", dayjs().add(-1, "day"));
    setValue("endDate", dayjs());
  }, [setValue]);




  const memberVPosList = useMemo(() => {
    return rawMemberVPosList?.data?.map(
      (memberVPos: { bankName: string; bankCode:string}) => {
        return {
          label: `${memberVPos.bankName}`,
          value: memberVPos.bankCode,
        };
      }
    );
  }, [rawMemberVPosList?.data]);


  

  const onSubmit = (data: BankPaymentValuesType) => {
    setTableData(undefined);
    const req: GetBankPaymentRequest = {
      date: data?.date ? dayjs(data.date).format("YYYY-MM-DD") : "",
     bankCode: data.bankCode, // Üye işyeri ID
     page: paginationModel.page,
     size: paginationModel.pageSize,
     orderByDesc: true, // Sipariş sırası
     orderBy: "CreateDate", // Siparişe göre
    //  status: data.status, // Durum
    };

    GetBankPayment(req, {
      onSuccess: (data) => {
        console.log(data);
        
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

  useEffect(() => {
    getMemberVPosList({
      orderBy: "CreateDate",
      orderByDesc: true,
      status: "ACTIVE",
    });
  }, [getMemberVPosList]);

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
      <BankPaymentModal transaction={transaction} isOpen={isModalOpen} handleClose={handleCloseModal} />
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
      { field: "bankCode", headerName: "Banka Kodu", width: 180 },
      {
        field: "bankName",
        headerName: "Banka Adı",
        width: 300,
      },
      {
        field: "brutTutar",
        headerName: "Brüt Tutar",
        width: 200,
        valueFormatter: (params: GridValueFormatterParams<number>) => {
          if (params.value == null) {
            return "";
          }
          return `${params.value} TL`;
        },
      },
      {
        field: "totalBankAmount",
        headerName: "Toplam Banka Tutarı",
        width: 200,
        valueFormatter: (params: GridValueFormatterParams<number>) => {
          if (params.value == null) {
            return "";
          }
          return `${params.value} TL`;
        },
      },
      {
        field: "totalBankCommissionAmount",
        headerName: "Toplam Banka Komisyon Tutarı",
        width: 200,
        valueFormatter: (params: GridValueFormatterParams<number>) => {
          if (params.value == null) {
            return "";
          }
          return `${params.value} TL`;
        },
      },{
        field: 'endOfDayDate',
        headerName: 'Gün Sonu Tarih',
        width: 200,
        valueFormatter: (params: GridValueFormatterParams<string>) => {
          const date = new Date(params.value);
          const day = date.getDate().toString().padStart(2, '0');
          const month = (date.getMonth() + 1).toString().padStart(2, '0'); // +1 çünkü aylar 0'dan başlar
          const year = date.getFullYear();
      
          return `${day}-${month}-${year}`;
        },
      },

 
    ];
  }, [deleteRow, showDelete]);

  const handleChangePagination = (model: GridPaginationModel) => {
    setPaginationModel(model);
    const req: GetBankPaymentRequest = {
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

    GetBankPayment(req, {
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
    GetBankPayment(
      {
        size: -1,
        page: 0,
        orderBy: "CreateDate",
        orderByDesc: true,
        date: dayjs(getValues("date")).format("YYYY-MM-DD"),
      },
      {
        onSuccess: (data) => {
          if (data.isSuccess) {
            downloadExcel(data?.data?.result || [], "Banka Hak Ediş Raporları");
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
    isGetBankPaymentLoading

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

              <FormControl sx={{ flex: 1 }}>
  {memberVPosList ? (
    <Controller
      control={control}
      name="bankCode"
      render={({ field }) => { // Add this line
        return (
          <>
            <Autocomplete
              sx={{ mr: isDesktop ? 3 : 0 }}
              onChange={(event, selectedValue) => {
                setSelectedMerchantVPosBankCode(selectedValue);
                field.onChange(selectedValue?.value); // Add this line
              }}
              id="bankCode"
              options={memberVPosList}
              value={selectedMerchantVPosBankCode}
              getOptionLabel={(option: {
                label: string;
                value: string;
              }) => option.label}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Banka"
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
            <Stack
              spacing={3}
              direction={isDesktop ? "row" : "column"}
              width={isDesktop ? 800 : "auto"}
            >
   
            </Stack>

            <Stack
              direction="row"
              justifyContent="flex-end"
              width={isDesktop ? 780 : "auto"}
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
              </>
            )}
          </Stack>
        </Stack>
      </Stack>
    </>
  );
};
