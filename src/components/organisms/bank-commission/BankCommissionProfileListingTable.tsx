// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/* eslint-disable jsx-a11y/anchor-is-valid */
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
  ICommissionProfileForPage,
  useDeleteCommissionProfile,
  useGetCommissionProfileList,
  PagingResponse,
  useGetCommissionProfileListForPage,
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
  onRowClick?: (data: { id: GridRowId; row: ICommissionProfileForPage }) => void;
};

export const BankCommissionListingProfileTable = ({
  onRowClick,
}: BankCommissionListingTableProps) => {
  const theme = useTheme();
  const {showDelete, showUpdate} = useAuthorization();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const [queryOptions, setQueryOptions] = React.useState({});
  const [tableData, setTableData] =
    useState<PagingResponse<Array<ICommissionProfileForPage>>>();
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 25,
  });
  const { mutate: getCommissionProfileListForPage, isLoading } =
  useGetCommissionProfileListForPage();
  const navigate = useNavigate();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState(0);
  const setSnackbar = useSetSnackBar();
  const { mutate: commissionProfileDelete, isLoading: isDeleteLoading } =
    useDeleteCommissionProfile();

  useEffect(() => {
    const requestPayload = {
      size: paginationModel.pageSize,
        page: paginationModel.page,
        orderBy: "CreateDate",
        orderByDesc: true,
        status: "ACTIVE",
    };
    if (queryOptions?.field && queryOptions?.value !== undefined) {
      requestPayload[queryOptions.field] = queryOptions.value;
    }

    getCommissionProfileListForPage(
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
    getCommissionProfileListForPage,
    paginationModel.page,
    paginationModel.pageSize,
    setSnackbar,
    queryOptions
  ]);

  const handleChangePagination = (model: GridPaginationModel) => {
    setPaginationModel(model);
    setTableData(undefined);

    getCommissionProfileListForPage(
      {
        size: paginationModel.pageSize,
        page: paginationModel.page,
        orderBy: "CreateDate",
        orderByDesc: true,
        status: "ACTIVE",
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
    (commissionProfile: ICommissionProfileForPage) => () => {
      navigate("/commission-management/commission-codedefinition-detail", {
        state: commissionProfile,
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

    commissionProfileDelete(deleteRequest, {
      onSuccess: (data: any) => {
        if (data.isSuccess) {
          getCommissionProfileListForPage({
            size: paginationModel.pageSize,
            page: paginationModel.page,
            orderBy: "CreateDate",
            orderByDesc: true,
            status: "ACTIVE",
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
      { field: "name", headerName: "Komisyon Adı", width: 200 },
      { field: "code", headerName: "Komisyon Kodu", width: 200 },
      { field: "description", headerName: "Açıklama", width: 200 },

    ];
  }, [deleteRow, editRow, showDelete, showUpdate]);

  const onSave = () => {
    const requestPayload = {
      size: -1,
      page: 0,
      orderBy: "CreateDate",
      orderByDesc: true,
      status: "ACTIVE",
    };

    if (queryOptions?.field && queryOptions?.value !== undefined) {
      requestPayload[queryOptions.field] = queryOptions.value;
    }
    getCommissionProfileListForPage(
   requestPayload,
      {
        onSuccess: (data) => {
          if (data.isSuccess) {
            downloadExcel(data?.data?.result || [], " Komisyon Profil Kodu Listesi");
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
      <Stack flex={1} p={2} justifyContent="space-between">
        {tableData?.result && (
          <>
            <Table
             handleFilterChange={handleFilterChange}
              paginationModel={paginationModel}
              onPaginationModelChange={handleChangePagination}
              paginationMode="server"
              rowCount={tableData?.totalItems}
              sx={{ width: isDesktop ? 1308 : window.innerWidth - 50 }}
              onRowClick={onRowClick}
              isRowSelectable={() => false}
              // disableColumnMenu
              rows={tableData?.result}
              columns={columns}
              exportFileName="Komisyon Profil Kodu Listesi"
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
