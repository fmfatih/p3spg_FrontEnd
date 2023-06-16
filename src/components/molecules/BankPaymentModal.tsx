// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState, useMemo } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import { Stack, useMediaQuery, useTheme } from "@mui/material";
import { Table } from "../molecules";
import { GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { useGetBankPaymentDetail } from "../../hooks";
import { default as dayjs } from "dayjs";
import { downloadExcel } from "../../util/downloadExcel";
import { useSetSnackBar } from "../../store/Snackbar.state";
export function BankPaymentModal({ transaction, isOpen, handleClose }) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [tableData, setTableData] = useState([]);
  const setSnackbar = useSetSnackBar();
  const {
    mutate: GetBankPaymentDetail,
    isLoading: isGetBankPaymentDetailLoading,
  } = useGetBankPaymentDetail();
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 10,
  });

  const handleChangePagination = (model: GridPaginationModel) => {
    setPaginationModel(model);
    const req: GetMerchantPaymenDetailtRequest = {
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

    GetBankPaymentDetail(req, {
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

  const columns: GridColDef[] = useMemo(() => {
    return [
      { field: "merchantId", headerName: "Üyer İşyeri Numarası", width: 150 },
      { field: "merchantName", headerName: "Üye İşyeri Adı", width: 200 },
      { field: "maskedPan", headerName: "Kart Numarası", width: 200 },
      { field: "orderId", headerName: "Sipariş Numarası", width: 250 },
      { field: "bankName", headerName: "Banka Adı", width: 300 },
      { field: "bankCode", headerName: "Banka Kodu", width: 180 },
      { field: "status", headerName: "İşlem Durumu", width: 150 },
      {
        field: "transactionDate",
        headerName: "İşlem Tarihi",
        width: 200,
        valueFormatter: (params: GridValueFormatterParams<string>) => {
          const date = new Date(params.value);
          const day = date.getDate().toString().padStart(2, "0");
          const month = (date.getMonth() + 1).toString().padStart(2, "0"); // +1 çünkü aylar 0'dan başlar
          const year = date.getFullYear();

          return `${day}-${month}-${year}`;
        },
      },
      { field: "installmentCount", headerName: "Taksit Sayısı", width: 180 },
      { field: "txnType", headerName: "İşlem Tipi", width: 180 },
      {
        field: "totalAmount",
        headerName: "Toplam Tutar",
        width: 200,
        valueFormatter: (params: GridValueFormatterParams<number>) =>
          `${params.value} TL`,
      },
      {
        field: "amount",
        headerName: "Tutar",
        width: 200,
        valueFormatter: (params: GridValueFormatterParams<number>) =>
          `${params.value} TL`,
      },
      { field: "currency", headerName: "Para Birimi Kodu", width: 150 },

      {
        field: "cardHolderName",
        headerName: "İşlem Yapılan Kart Bilgisi",
        width: 200,
      },

      { field: "bankblocked", headerName: "Banka Blokesi", width: 180 },
      { field: "bankblockedday", headerName: "Banka Bloke Günü", width: 200 },
      {
        field: "bankCommissionAmount",
        headerName: "Banka Komisyon Tutarı",
        width: 200,
        valueFormatter: (params: GridValueFormatterParams<number>) =>
          `${params.value} TL`,
      },
      {
        field: "bankAmount",
        headerName: "Banka Tutarı",
        width: 200,
        valueFormatter: (params: GridValueFormatterParams<number>) =>
          `${params.value} TL`,
      },
      {
        field: "merchantblocked",
        headerName: "Üye İşyeri Blokesi",
        width: 200,
      },
      {
        field: "merchantblockedday",
        headerName: "Üye İşyeri Bloke Günü",
        width: 200,
      },
      {
        field: "merchantCommisionAmount",
        headerName: "Üye İşyeri Komisyon Tutarı",
        width: 200,
        valueFormatter: (params: GridValueFormatterParams<number>) =>
          `${params.value} TL`,
      },
      {
        field: "merchantAmount",
        headerName: "Üye İşyeri Tutarı",
        width: 200,
        valueFormatter: (params: GridValueFormatterParams<number>) =>
          `${params.value} TL`,
      },
      {
        field: "customerCommissionAmount",
        headerName: "Müşteri Komisyon Tutarı",
        width: 200,
        valueFormatter: (params: GridValueFormatterParams<number>) =>
          `${params.value} TL`,
      },
      {
        field: "revenue",
        headerName: "Gelir",
        width: 200,
        valueFormatter: (params: GridValueFormatterParams<number>) =>
          `${params.value} TL`,
      },
      { field: "cardType", headerName: "Kart Tipi", width: 180 },
      { field: "authCode", headerName: "Yetkilendirme Kodu", width: 180 },
      {
        field: "endOfDayDate",
        headerName: "Gün Sonu Tarih",
        width: 200,
        valueFormatter: (params: GridValueFormatterParams<string>) => {
          const date = new Date(params.value);
          const day = date.getDate().toString().padStart(2, "0");
          const month = (date.getMonth() + 1).toString().padStart(2, "0"); // +1 çünkü aylar 0'dan başlar
          const year = date.getFullYear();

          return `${day}-${month}-${year}`;
        },
      },

      {
        field: "originalOrderId",
        headerName: "Orjinal Sipariş ID",
        width: 250,
      },
      { field: "paymentFlag", headerName: "Ödeme Yapıldı Mı?", width: 180 },
    ];
  }, []);

  useEffect(() => {
    if (isOpen && transaction) {
      GetBankPaymentDetail(
        { bankCode: transaction.bankCode, date: transaction.endOfDayDate },
        {
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
        }
      );
    }
  }, [isOpen, transaction]);

  const onSave = () => {
    GetBankPaymentDetail(
      {
        size: -1,
        page: 0,
        orderBy: "CreateDate",
        orderByDesc: true,
        bankCode: transaction?.bankCode,
        date: dayjs(transaction?.endOfDayDate).format("YYYY-MM-DD"),
      },
      {
        onSuccess: (data) => {
          if (data.isSuccess) {
            downloadExcel(
              data?.data?.result || [],
              "Banka Hak Ediş Raporları Detay"
            );
          } else {
            setSnackbar({
              severity: "error",
              description: data.message,
              isOpen: true,
            });
          }
        },
        onError: () => {
          console.log(error);
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
    <Modal
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: isDesktop ? 1300 : isSmallScreen ? "90%" : "70%",
          height: isDesktop ? 800 : isSmallScreen ? "90%" : "80%",
          bgcolor: "background.paper",
          border: "2px solid #2196f3",
          boxShadow: 24,
          p: 4,
          display: "relative",
        }}
      >
        <h2 id="modal-modal-title">Banka Hak Ediş Raporları Detay</h2>

        <Stack
          justifyContent="center"
          sx={{ width: 1, height: 600, flexGrow: 1 }}
        >
          {tableData && (
            <>
              <Table
                paginationModel={paginationModel}
                onPaginationModelChange={handleChangePagination}
                paginationMode="server"
                rowCount={tableData.totalItems}
                // rowCount={tableData?.length}
                sx={{
                  width: isDesktop ? 1240 : "auto",
                  height: isDesktop ? "600px" : "auto",
                }}
                isRowSelectable={() => false}
                disableColumnMenu
                rows={tableData}
                // getRowId={(row) => row.merchantId}
                // rows={tableData || []}
                autoHeight={!isDesktop}
                columns={columns}
                exportFileName="Banka Hak Ediş Raporları"
                getRowId={(row) => row.merchantId}
                onSave={() => onSave()}
              />
            </>
          )}
        </Stack>
        {/* <Button onClick={handleClose}>Close</Button> */}
        <IconButton
          sx={{
            position: "absolute",
            top: 2,
            right: 2,
          }}
          onClick={handleClose}
        >
          <CloseIcon />
        </IconButton>
      </Box>
    </Modal>
  );
}
