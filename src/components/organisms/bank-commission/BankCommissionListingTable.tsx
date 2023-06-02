import React, { useEffect, useMemo, useState } from "react";
import { Stack, useMediaQuery, useTheme } from "@mui/material";
import {
  GridColDef,
  GridRowId,
  GridRenderCellParams,
  GridActionsCellItem,
  GridValueFormatterParams,
  GridPaginationModel,
} from "@mui/x-data-grid";
import { DeleteConfirmModal, Table } from "../../molecules";
import { Loading } from "../../atoms";
import {
  DeleteCommissionParameterRequest,
  ICommissionParameter,
  useDeleteCommissionParameter,
  useGetCommissionParameterList,
  PagingResponse,
  useAuthorization,
} from "../../../hooks";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import { useSetSnackBar } from "../../../store/Snackbar.state";
import { useNavigate } from "react-router-dom";
import { downloadExcel } from "../../../util/downloadExcel";

function RenderCheckBar(props: GridRenderCellParams<any, string>) {
  const { value } = props;

  return value ? (
    <CheckCircleOutlineIcon style={{ color: "#00B0A6" }} />
  ) : (
    <CloseIcon style={{ color: "#F5004A" }} />
  );
}

type BankCommissionListingTableProps = {
  onRowClick?: (data: { id: GridRowId; row: ICommissionParameter }) => void;
};

export const BankCommissionListingTable = ({
  onRowClick,
}: BankCommissionListingTableProps) => {
  const theme = useTheme();
  const {showDelete, showUpdate} = useAuthorization();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const [tableData, setTableData] =
    useState<PagingResponse<Array<ICommissionParameter>>>();
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 25,
  });
  const { mutate: getCommissionParameterList, isLoading } =
    useGetCommissionParameterList();
  const navigate = useNavigate();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState(0);
  const setSnackbar = useSetSnackBar();
  const { mutate: commissionParameterDelete, isLoading: isDeleteLoading } =
    useDeleteCommissionParameter();

  useEffect(() => {
    getCommissionParameterList(
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
  }, [
    getCommissionParameterList,
    paginationModel.page,
    paginationModel.pageSize,
    setSnackbar,
  ]);

  const handleChangePagination = (model: GridPaginationModel) => {
    setPaginationModel(model);
    setTableData(undefined);

    getCommissionParameterList(
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
    (commissionParameter: ICommissionParameter) => () => {
      navigate("/commission-management/commission-definition", {
        state: commissionParameter,
      });
    },
    [navigate]
  );

  const deleteRow = React.useCallback(
    (commission: any) => () => {
      setIsDeleteModalOpen(true);
      setSelectedRowId(Number(commission.id));
    },
    []
  );

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    const deleteRequest: DeleteCommissionParameterRequest = {
      id: selectedRowId,
    };

    commissionParameterDelete(deleteRequest, {
      onSuccess: (data: any) => {
        if (data.isSuccess) {
          getCommissionParameterList({
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

  const columns: GridColDef[] = useMemo(() => {
    return [
      {
        field: "Aksiyonlar",
        type: "actions",
        width: 80,
        getActions: (params) => [
          !!showUpdate ? <GridActionsCellItem
            onClick={editRow(params.row)}
            label="Düzenle"
            showInMenu
          /> : <></>,
          !!showDelete ? <GridActionsCellItem
            label="Sil"
            onClick={deleteRow(params.row)}
            showInMenu
          /> : <></>,
        ],
      },
      { field: "profileCode", headerName: "Profil", width: 200 },
      { field: "merchantId", headerName: "Üye İşyeri Kodu", width: 150 },
      { field: "merchantName", headerName: "Üye İşyeri Adı", width: 380 },
      { field: "txnType", headerName: "İşlem Tipi", width: 200 },
      {
        field: "onus",
        headerName: "Onus",
        width: 100,
        renderCell: RenderCheckBar,
      },
      {
        field: "international",
        headerName: "International",
        width: 130,
        renderCell: RenderCheckBar,
      },
      {
        field: "amex",
        headerName: "Amex",
        width: 100,
        renderCell: RenderCheckBar,
      },
      { field: "installment", headerName: "Taksit Sayısı", width: 150 },
      { field: "bankcode", headerName: "Banka Kodu", width: 150 },
      { field: "bankName", headerName: "Banka Adı", width: 350 },
      { field: "bankblocked", headerName: "Banka Blokesi", width: 150 },
      { field: "bankblockedday", headerName: "Banka Bloke Gün", width: 150 },
      {
        field: "bankcommission",
        headerName: "Banka Komisyon",
        width: 150,
        valueFormatter: (params: GridValueFormatterParams<number>) => {
          if (params.value == null) {
            return "";
          }
          return `${params.value} %`;
        },
      },
      { field: "merchantblocked", headerName: "İşyeri Blokesi", width: 150 },
      {
        field: "merchantblockedday",
        headerName: "İşyeri Bloke Gün",
        width: 150,
      },
      {
        field: "merchantcommission",
        headerName: "İşyeri Komisyon",
        width: 150,
        valueFormatter: (params: GridValueFormatterParams<number>) => {
          if (params.value == null) {
            return "";
          }
          return `${params.value} %`;
        },
      },
      {
        field: "merchantadditionalcommission",
        headerName: "Üye İşyeri Ücreti",
        width: 150,
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
        width: 150,
        valueFormatter: (params: GridValueFormatterParams<number>) => {
          if (params.value == null) {
            return "";
          }
          return `${params.value} %`;
        },
      },
      {
        field: "customeradditionalcommission",
        headerName: "Müşteri Ücreti",
        width: 200,
        valueFormatter: (params: GridValueFormatterParams<number>) => {
          if (params.value == null) {
            return "";
          }
          return `${params.value} TL`;
        },
      },
      { field: "cardType", headerName: "Kart Tipi", width: 150 },
      {
        field: "minAmount",
        headerName: "En Düşük Tutar",
        width: 200,
        valueFormatter: (params: GridValueFormatterParams<number>) => {
          if (params.value == null) {
            return "";
          }
          return `${params.value} TL`;
        },
      },
      {
        field: "maxAmount",
        headerName: "En Yüksek Tutar",
        width: 200,
        valueFormatter: (params: GridValueFormatterParams<number>) => {
          if (params.value == null) {
            return "";
          }
          return `${params.value} TL`;
        },
      },
      { field: "status", headerName: "Durum", width: 200 },
      { field: "systemDate", headerName: "Düzenlenme Tarihi", width: 200 },
      {
        field: "createUserName",
        headerName: "Düzenleyen Kullanıcı",
        width: 200,
      },
      { field: "updateDate", headerName: "Güncellenme Tarihi", width: 200 },
      {
        field: "updateUserName",
        headerName: "Güncelleyen Kullanıcı",
        width: 200,
      },
    ];
  }, [deleteRow, editRow, showDelete, showUpdate]);

  const onSave = () => {
    getCommissionParameterList(
      {
        size: -1,
        page: 0,
        orderBy: "CreateDate",
        orderByDesc: true,
      },
      {
        onSuccess: (data) => {
          if (data.isSuccess) {
            downloadExcel(data?.data?.result || [], "Banka Komisyon Listesi");
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

  const hasLoading = isLoading || isDeleteLoading;
  return (
    <>
      {hasLoading && <Loading />}
      <Stack flex={1} p={2} justifyContent="space-between">
        {tableData?.result?.length && (
          <>
            <Table
              paginationModel={paginationModel}
              onPaginationModelChange={handleChangePagination}
              paginationMode="server"
              rowCount={tableData.totalItems}
              sx={{ width: isDesktop ? 1308 : window.innerWidth - 50 }}
              onRowClick={onRowClick}
              isRowSelectable={() => false}
              disableColumnMenu
              rows={tableData.result}
              columns={columns}
              exportFileName="Banka Komisyon Listesi"
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
    </>
  );
};
