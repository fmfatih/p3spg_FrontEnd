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
import { API_ADDRESS } from "../../config/server";

export function DocumentViewingModal({  isOpen, handleClose, merchantId }) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [tableData, setTableData] = useState([]);
  const [filePath, setFilePath] = useState("");
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
              const docType = data.data.docType.toLowerCase();

              // let fileBase = API_ADDRESS.replace('/api', '');
              let fileBase = process.env.REACT_APP_API_ADDRESS.replace('/api', '');
              if(fileBase.includes(':5001')) {
                  fileBase = fileBase.replace(':5001', ':5002');
              }
              const newFilePath = `${fileBase}/${data.data.path}`;
              setFilePath(newFilePath); 
              
        
              if (docType === "png" || docType === "jpg" || docType === "pdf") {
                setTableData({...data.data, docType}); 
              } 
           
              else if (docType === "xlsx" || docType === "xls") {       
                const link = document.createElement('a');
                link.href = newFilePath;
                link.setAttribute('download', 'file.xlsx');
                link.style.display = 'none';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                handleClose();
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

<Stack justifyContent="center" sx={{ width: 1, height: '100%', flexGrow: 1 }}>
  {
    (tableData.docType === "png" || tableData.docType === "jpg" || tableData.docType === "jpeg" ) ? (
      <img src={filePath} alt={tableData.fileName} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
    ) : tableData.docType === "pdf" ? (
      <embed src={filePath} type="application/pdf" style={{width: '100%', height: '100%'}} />
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
