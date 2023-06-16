// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import { Stack, useMediaQuery, useTheme } from "@mui/material";
import { Table } from "../molecules";
import { GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { useGetMerchantPaymentDetail } from "../../hooks";
import { default as dayjs } from "dayjs";
import { downloadExcel } from "../../util/downloadExcel";

export function MechantPaymentModal({ transaction, isOpen, handleClose }) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [tableData, setTableData] = useState([]);
  const {
    mutate: GetMerchantPaymentDetail,
    isLoading: isGetMerchantPaymentDetailLoading,
  } = useGetMerchantPaymentDetail();
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 10,
  });

  const handleChangePagination = (model: GridPaginationModel) => {
    setPaginationModel(model);
    const req: GetMerchantPaymenDetailtRequest = {
      date: getValues("startDate")
        ? dayjs(getValues("startDate")).format("YYYY-MM-DD HH:mm:ss")
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

    GetMerchantPaymentDetail(req, {
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
      { field: "merchantId", headerName: "Üye İşyeri Numarası", width: 180 },
      { field: "amount", headerName: "Tutar", width: 120 },
      { field: "authCode", headerName: "Auth Kodu", width: 150 },
      { field: "bankAmount", headerName: "Banka Tutarı", width: 150 },
      { field: "bankCode", headerName: "Banka Kodu", width: 120 },
      {
        field: "bankCommissionAmount",
        headerName: "Banka Komisyon Tutarı",
        width: 200,
      },
      { field: "bankName", headerName: "Banka Adı", width: 180 },
      { field: "bankblocked", headerName: "Banka Engellendi mi?", width: 180 },
      {
        field: "bankblockedday",
        headerName: "Banka Engelleme Günü",
        width: 200,
      },
      { field: "cardHolderName", headerName: "Kart Sahibi Adı", width: 180 },
      { field: "cardType", headerName: "Kart Türü", width: 120 },
      { field: "currency", headerName: "Para Birimi", width: 150 },
      {
        field: "customerCommissionAmount",
        headerName: "Müşteri Komisyon Tutarı",
        width: 200,
      },
      { field: "endOfDayDate", headerName: "Gün Sonu Tarihi", width: 150 },
      { field: "installmentCount", headerName: "Taksit Sayısı", width: 150 },
      { field: "maskedPan", headerName: "Maskeleme Pan", width: 180 },
      { field: "merchantAmount", headerName: "İşyeri Tutarı", width: 150 },
      {
        field: "merchantCommisionAmount",
        headerName: "İşyeri Komisyon Tutarı",
        width: 200,
      },
      { field: "merchantName", headerName: "İşyeri Adı", width: 180 },
      {
        field: "merchantblocked",
        headerName: "İşyeri Engellendi mi?",
        width: 180,
      },
      {
        field: "merchantblockedday",
        headerName: "İşyeri Engelleme Günü",
        width: 200,
      },
      { field: "paymentFlag", headerName: "Ödeme Yapıldı Mı?", width: 150 },
      { field: "revenue", headerName: "Gelir", width: 120 },
      { field: "status", headerName: "Durum", width: 120 },
      { field: "totalAmount", headerName: "Toplam Tutar", width: 150 },
      { field: "transactionDate", headerName: "İşlem Tarihi", width: 150 },
      { field: "txnType", headerName: "İşlem Türü", width: 120 },
    ];
  }, []);

  useEffect(() => {
    if (isOpen && transaction) {
      GetMerchantPaymentDetail(
        { merchantId: transaction.merchantId, date: transaction.endOfDayDate },
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
    GetMerchantPaymentDetail(
      {
        size: -1,
        page: 0,
        orderBy: "CreateDate",
        orderByDesc: true,
        merchantId: transaction?.merchantId,
        date: dayjs(transaction?.endOfDayDate).format("YYYY-MM-DD"),
      },
      {
        onSuccess: (data) => {
          if (data.isSuccess) {
            downloadExcel(
              data?.data?.result || [],
              "İşyeri Hak Ediş Raporları Detay"
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
        <h2 id="modal-modal-title">İşyeri Hak Ediş Raporları Detay</h2>

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
                exportFileName="İşyeri Hak Ediş Raporları"
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
