import React, { useEffect, useMemo, useState } from "react";
import {  Stack, useMediaQuery, useTheme } from "@mui/material";
import {
  GridColDef,
  GridActionsCellItem,
  GridRowId,
  GridRenderCellParams,
  GridPaginationModel,
} from "@mui/x-data-grid";
import { DeleteConfirmModal, DocumentDetailModal, Table } from "../../molecules";
import { Loading, StatusBar,Button } from "../../atoms";
import {
  DeleteMerchantRequest,
  IMerchant,
  PagingResponse,
  useAuthorization,
  useGetMerchantList,
  useMerchantDelete,
} from "../../../hooks";
import { useNavigate } from "react-router-dom";
import { useSetSnackBar } from "../../../store/Snackbar.state";
import { downloadExcel } from "../../../util/downloadExcel";
import { useUserInfo } from "../../../store/User.state";

function RenderStatus(props: GridRenderCellParams<any, string>) {
  const { value } = props;

  return <>{value && <StatusBar status={value} />}</>;
}

type MerchantListingTableProps = {
  onRowClick?: (data: { id: GridRowId; row: IMerchant }) => void;
};

export const MerchantListingTable = ({
  onRowClick,
}: MerchantListingTableProps) => {
  const theme = useTheme();
  const {showDelete, showUpdate} = useAuthorization();
  const [userInfo] = useUserInfo();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const [queryOptions, setQueryOptions] = React.useState({});
  const [tableData, setTableData] = useState<PagingResponse<Array<any>>>();
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 25,
  });
  const navigate = useNavigate();
  const { mutate: getMerchantList, isLoading } = useGetMerchantList();
  const setSnackbar = useSetSnackBar();

  useEffect(() => {
    const requestPayload = {
      size: paginationModel.pageSize,
        page: paginationModel.page,
        orderBy: "CreateDate",
        orderByDesc: true,
      merchantId: userInfo ? Number(userInfo.merchantId) : undefined
    };

    if (queryOptions?.field && queryOptions?.value !== undefined) {
      requestPayload[queryOptions.field] = queryOptions.value;
    }

    getMerchantList(
    requestPayload,
      {
        onSuccess: (data) => {
          if (data.isSuccess) {
            setTableData(data?.data);
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
  }, [
    getMerchantList,
    paginationModel.page,
    paginationModel.pageSize,
    setSnackbar,
    queryOptions
  ]);

  const handleChangePagination = (model: GridPaginationModel) => {
    setPaginationModel(model);
    setTableData(undefined);

    getMerchantList(
      {
        size: paginationModel.pageSize,
        page: paginationModel.page,
        orderBy: "CreateDate",
        orderByDesc: true,
      },
      {
        onSuccess: (data) => {
          if (data.isSuccess) {
            setTableData(data?.data);
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

  const editRow = React.useCallback(
    (merchant: IMerchant) => () => {
      navigate("/merchant-management/merchant-identification", {
        state: merchant,
      });
    },
    [navigate]
  );

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState(0);
  const { mutate: merchantDelete, isLoading: isDeleteLoading } =
    useMerchantDelete();

  const deleteRow = React.useCallback(
    (merchant: IMerchant) => () => {
      setIsDeleteModalOpen(true);
      setSelectedRowId(Number(merchant.id));
    },
    []
  );

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    const deleteRequest: DeleteMerchantRequest = { id: selectedRowId };

    merchantDelete(deleteRequest, {
      onSuccess: (data: any) => {
        if (data.isSuccess) {
          getMerchantList({
            size: paginationModel.pageSize,
            page: paginationModel.page,
            orderBy: "CreateDate",
            orderByDesc: true,
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

    handleCloseDeleteModal();
  };
  

  // const documentSaw = React.useCallback(
  //   (merchant: IMerchant) => () => {
  //     navigate("/merchant-management/document-add", {
  //       state: merchant,
  //     });
  //   },
  //   [navigate]
  // );
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
            text="Döküman"
            sx={{flex:1,height:20,py:4}}
        >
        </Button>
        <DocumentDetailModal merchantId={merchantId} isOpen={isModalOpen} handleClose={handleCloseModal} />
      </>
    );
}

  const columns: GridColDef[] = useMemo(() => {
    return [
      {
        field: "Aksiyonlar",
        type: "actions",
        width: 80,
        getActions: (params) => {
          return [
            !!showUpdate ? <GridActionsCellItem
              label="Düzenle"
              onClick={editRow(params.row)}
              showInMenu
            /> : <></>,
            !!showDelete ? <GridActionsCellItem
              label="Sil"
              onClick={deleteRow(params.row)}
              showInMenu
            /> : <></>
          ];
        },
      },
     {
        field: "documentButton",
        headerName: "Doküman",
        width: 150,
        renderCell: (params) => {
          return <RenderActionButton merchantId={params.row.merchantId} />
        },
      },
      { field: "merchantId", headerName: "İşyeri No", width: 200 },
      { field: "merchantName", headerName: "İşyeri Adı", width: 400 },
      {
        field: "parentMerchantName",
        headerName: "Bağlı Olduğu İşyeri Adı",
        width: 350,
      },
      {
        field: "commissionProfileCode",
        headerName: "Çalışma Grubu",
        width: 200,
      },
      { field: "taxNumber", headerName: "Vergi Kimlik No.", width: 200 },
      { field: "taxOfficeName", headerName: "Vergi Dairesi", width: 300 },
      { field: "mcc", headerName: "MCC", width: 100 },
      {
        field: "aggreementDateFormatted",
        headerName: "Sözleşme Tarihi",
        width: 200,
      },
      {
        field: "openingDateFormatted",
        headerName: "İşyeri Açılış Tarihi",
        width: 200,
      },
      {
        field: "closedDateFormatted",
        headerName: "İşyeri Kapanış Tarihi",
        width: 200,
      },
      { field: "webSite", headerName: "Web Sitesi", width: 300 },
      { field: "try", headerName: "TRY", width: 200 },
      { field: "usd", headerName: "USD", width: 200 },
      { field: "eur", headerName: "EUR", width: 200 },
      { field: "iban", headerName: "IBAN", width: 300 },
      {
        renderCell: RenderStatus,
        field: "status",
        headerName: "İşyeri Durumu",
        width: 150,
      },
      {
        field: "partnerOneFullName",
        headerName: "Ortak 1 Ad Soyad",
        width: 300,
      },
      {
        field: "partnerOneCitizenNumber",
        headerName: "Ortak 1 Kimlik No.",
        width: 200,
      },
      {
        field: "partnerOneMobilePhone",
        headerName: "Ortak 1 Cep Telefonu",
        width: 200,
      },
      {
        field: "partnerTwoFullName",
        headerName: "Ortak 2 Ad Soyad",
        width: 300,
      },
      {
        field: "partnerTwoCitizenNumber",
        headerName: "Ortak 2 Kimlik No.",
        width: 200,
      },
      {
        field: "partnerTwoMobilePhone",
        headerName: "Ortak 2 Cep Telefonu",
        width: 200,
      },
    ];
  }, [deleteRow, editRow, showDelete, showUpdate]);

  const onSave = () => {
    const requestPayload = {
      size: -1,
      page: 0,
      orderBy: "CreateDate",
      orderByDesc: true,
    };

    if (queryOptions?.field && queryOptions?.value !== undefined) {
      requestPayload[queryOptions.field] = queryOptions.value;
    }
    getMerchantList(
  requestPayload,
      {
        onSuccess: (data) => {
          if (data.isSuccess) {
            downloadExcel(data?.data?.result || [], "Üye İşyeri Listesi");
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

  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(null, args);
      }, delay);
    };
  };

  const handleFilterChange = debounce((props) => {
    if (props === "clearFilter") {
      return setQueryOptions({});
    }
    if (props.value?.toString()?.length >= 1) {
      setQueryOptions(props);
    }
  }, 500);

  const hasLoading = isLoading || isDeleteLoading;
  return (
    <>
      {hasLoading && <Loading />}
      <Stack flex={1} p={2}>
        {tableData?.result?.length && (
          <>
            <Table
             handleFilterChange={handleFilterChange}
              paginationModel={paginationModel}
              onPaginationModelChange={handleChangePagination}
              paginationMode="server"
              rowCount={tableData.totalItems}
              sx={{ width: isDesktop ? 1308 : window.innerWidth - 50 }}
              onRowClick={onRowClick}
              isRowSelectable={() => false}
              // disableColumnMenu
              rows={tableData.result}
              columns={columns}
              exportFileName="Üye İşyeri Listesi"
              onSave={() => onSave()}
              getRowClassName={(params) => params.row.status === 'ACTIVE' ? '' : 'pasive-row'}
              
            />
            <DeleteConfirmModal
              isOpen={isDeleteModalOpen}
              onClose={handleCloseDeleteModal}
              onConfirm={() => handleDeleteConfirm()}
            ></DeleteConfirmModal>
          </>
        )}
      </Stack>
    </>
  );
};
