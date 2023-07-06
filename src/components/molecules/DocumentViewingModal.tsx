// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import { Stack, useMediaQuery, useTheme } from "@mui/material";
import { DeleteConfirmModal, Table } from ".";
import { GridActionsCellItem, GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { useAuthorization, useDocumentDelete, useGetDocumentGetById, useGetDocumentList, useGetMerchantPaymentDetail } from "../../hooks";
import { default as dayjs } from "dayjs";
import { downloadExcel } from "../../util/downloadExcel";

export function DocumentViewingModal({  isOpen, handleClose, merchantId }) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [tableData, setTableData] = useState([]);
  const {
    mutate:  getDocumentGetById,
  } = useGetDocumentGetById();

  // useEffect(() => {
  //   if (isOpen && merchantId) {

  //     getDocumentGetById(
  //     { id: merchantId },
  //       {
  //         onSuccess: (data) => {
  //           if (data.isSuccess) {
  //             setTableData(data.data);
           
  //             setSnackbar({
  //               severity: "success",
  //               isOpen: true,
  //               description: data.message,
  //             });
  //           } else {
  //             setSnackbar({
  //               severity: "error",
  //               description: data.message,
  //               isOpen: true,
  //             });
  //           }
  //         },
  //         onError: () => {
  //           setSnackbar({
  //             severity: "error",
  //             description: "İşlem sırasında bir hata oluştu",
  //             isOpen: true,
  //           });
  //         },
  //       }
  //     );
  //   }
  // }, [isOpen,merchantId]);

  useEffect(() => {
    if (isOpen && merchantId) {
      getDocumentGetById(
        { id: merchantId },
        {
          onSuccess: (data) => {
            if (data.isSuccess) {
              // Dosya uzantısını burada alıyoruz
              const fileExtension = data.data.fileName.split(".").pop().toLowerCase();
  
              // Eğer dosya tipi bir görüntü veya PDF ise, bu dosyayı bir modal içerisinde göstermek istiyoruz.
              if (fileExtension === "png" || fileExtension === "jpg" || fileExtension === "pdf") {
                setTableData({...data.data, fileExtension}); // fileExtension ekliyoruz
              } 
              // Eğer dosya tipi bir Excel dosyası ise, bu dosyayı kullanıcının bilgisayarına indirmek istiyoruz.
              else if (fileExtension === "xlsx" || fileExtension === "xls") {
                downloadExcel(data.data, data.data.fileName); // İndirme işlemi
                handleClose(); // Modalı kapat
              }
  
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
  }, [isOpen, merchantId]);
  
  return (
<Modal
  open={isOpen}
  onClose={handleClose}
  aria-labelledby="modal-modal-title"
  aria-describedby="modal-modal-description"
  style={{ backdropFilter: "blur(15px)" }} 
>
  <Box
    sx={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: isDesktop ? "100%" : isSmallScreen ? "90%" : "70%",
      height: isDesktop ? "100%" : isSmallScreen ? "90%" : "80%",
      // bgcolor: "background.paper",
      // border: "2px solid #2196f3",
      boxShadow: 24,
      p: 4,
      display: "relative",
    }}
  >
    <h2 id="modal-modal-title" style={{color:"white"}}>Dokuman Ön izleme</h2>

    {/* <Stack justifyContent="center" sx={{ width: 1, height: "100%", flexGrow: 1 }}>
  {
    (tableData.fileExtension === "png" || tableData.fileExtension === "jpg") ? (
      <img src={tableData.fileURL} alt={tableData.fileName} />
    ) : tableData.fileExtension === "pdf" ? (
      <embed src={tableData.fileURL} type="application/pdf" width="100%" height="100%" />
    ) : null
  }
</Stack> */}
<Stack justifyContent="center" sx={{ width: 1, height: '100%', flexGrow: 1 }}>
  {
    (tableData.fileExtension === "png" || tableData.fileExtension === "jpg") ? (
      <img src={tableData.fileURL} alt={tableData.fileName} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
    ) : tableData.fileExtension === "pdf" ? (
      <embed src={tableData.fileURL} type="application/pdf" style={{width: '100%', height: '100%'}} />
    ) : null
  }
</Stack>


    <IconButton
      sx={{
        position: "absolute",
        top: 2,
        right: 2,
        color:"white"
      }}
      onClick={handleClose}
    >
      <CloseIcon />
    </IconButton>
  </Box>
</Modal>

  );
}
