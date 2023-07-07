// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import { Stack, useMediaQuery, useTheme } from "@mui/material";
import { DeleteConfirmModal, DocumentViewingModal, Table } from ".";
import { GridActionsCellItem, GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { useAuthorization, useDocumentDelete, useDocumentUpdate, useGetDocumentList, useGetMerchantPaymentDetail } from "../../hooks";
import { useSetSnackBar } from "../../store/Snackbar.state";
import { default as dayjs } from "dayjs";
import { downloadExcel } from "../../util/downloadExcel";

export function DocumentDetailModal({  isOpen, handleClose, merchantId }) {
  const {showDelete, showUpdate} = useAuthorization();
  const theme = useTheme();
  const setSnackbar = useSetSnackBar();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [tableData, setTableData] = useState([]);
  const {
    mutate: getDocumentList,
  } = useGetDocumentList();


  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 10,
  });

  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState(0);
  const { mutate: deleteDocument, isLoading: isDeleteLoading } =
  useDocumentDelete();

  const deleteRow = (id: number) => {
    setIsDeleteModalOpen(true);
    setSelectedRowId(id);
  };
 
  

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    const deleteRequest: DeleteDocumentRequest = { id: selectedRowId };


    deleteDocument(deleteRequest, {
      onSuccess: (data: any) => {
        if (data.isSuccess) {
          getDocumentList({ id: merchantId })
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

    handleCloseDeleteModal();
  };

  const handleChangePagination = (model: GridPaginationModel) => {
    setPaginationModel(model);
    const req: GetMerchantPaymenDetailtRequest = {

    };

    getDocumentList(req, {
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

 const FileUpdateCell = ({ rowId }) => {

 
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState(null);
    const { mutate: documentUpdate } = useDocumentUpdate();
    
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
  setFile(selectedFile);
    }
  
    const handleSubmit = async () => {
      console.log(file);

      if (!file) return;

    
      setLoading(true);

      const formData = new FormData();
      formData.append('file', file);

      documentUpdate({formData, id: rowId}, {
        onSuccess: (data) => {
          setLoading(false);
          setFile(null); 
          if (data.isSuccess) {
            setSnackbar({
              severity: "success",
              isOpen: true,
              description: data.message || "Dosya başarıyla güncellendi",
            });
            getDocumentList({ id: merchantId });
          } else {
            setSnackbar({
              severity: "error",
              isOpen: true,
              description: data.message || "Dosya güncellenirken bir hata oluştu",
            });
          }
        },
        onError: (error) => {
          setLoading(false);
          setFile(null); 
          setSnackbar({
            severity: "error",
            isOpen: true,
            description: "İşlem sırasında bir hata oluştu",
          });
        },
      });
    }
    return (
      <>
        <input type="file" onChange={handleFileChange} />
        <Button 
          variant="contained" 
          color="primary" 
          disabled={!file || loading} 
          onClick={handleSubmit}
        >
          Güncelle
        </Button>
      </>
    );
  };

  const RenderActionButton = ({merchantId}) => {
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
            text="Görüntüle"
            sx={{flex:1,height:20,py:4}}
        >
         Görüntüle
        </Button>
        <DocumentViewingModal merchantId={merchantId} isOpen={isModalOpen} handleClose={handleCloseModal} />
      </>
    );
}

  const columns: GridColDef[] = useMemo(() => {
    return [
      {
        field: "Aksiyonlarr",
        type: "actions",
        width: 80,
        getActions: (params) => {      
          return [
            // !!showUpdate ? <GridActionsCellItem
            //   label="Düzenle"
            //   onClick={editRow(params.row)}
            //   showInMenu
            // /> : <></>,
            !!showDelete ? <GridActionsCellItem
              label="Sil"
              onClick={() => deleteRow(params.row.id)}
              showInMenu
            /> : <></>,
          ];
        },
      },
      {
        field: "documentViewingButton",
        headerName: "Görüntüleme",
        width: 150,
        renderCell: (params) => {
          return <RenderActionButton merchantId={params.row.id} />
        },
      },
      {
        field: "fileUpload",
        headerName: "Dosya Güncelle",
        width: 300,
        renderCell: (params) => <FileUpdateCell rowId={params.row.id} />,
      },
      { field: "merchantId", headerName: "Üye İşyeri Numarası", width: 180 },
      { field: "fileName", headerName: "Dosya Adı", width: 180 },
      { field: "createDate", headerName: "Oluşturulma Tarihi", width: 300 },
     
    
    ];
  }, [deleteRow,showDelete]);

  useEffect(() => {
    if (isOpen && merchantId) {

    getDocumentList(
      { id: merchantId },
        {
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
        }
      );
    }
  }, [isOpen,merchantId]);

  const onSave = () => {
    getDocumentList(
        { id: merchantId },
      {
        onSuccess: (data) => {
          if (data.isSuccess) {
            downloadExcel(
              data?.data || [],
              "Döküman Listesi"
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
        <h2 id="modal-modal-title">Doküman Listesi</h2>

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
                exportFileName="Döküman"
                // getRowId={(row) => row.id}
                onSave={() => onSave()}
              />
                  <DeleteConfirmModal
              isOpen={isDeleteModalOpen}
              onClose={handleCloseDeleteModal}
              onConfirm={() => handleDeleteConfirm()}
            ></DeleteConfirmModal>
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
