import {
  GridColDef,
  GridRowId,
  GridRenderCellParams,
  GridActionsCellItem,
  GridPaginationModel,
} from "@mui/x-data-grid";
import { useEffect, useMemo, useState } from "react";
import { Stack, Switch, useMediaQuery, useTheme } from "@mui/material";
import { DeleteConfirmModal, Table } from "../../molecules";
import { Loading, StatusBar } from "../../atoms";
import {
  DeleteMemberVPosRequest,
  IMemberVPos,
  useGetMemberVPosList,
  useMemberVPosDelete,
  useMemberVPosUpdate,
} from "../../../hooks";
import { useNavigate } from "react-router-dom";
import React from "react";
import { useSetSnackBar } from "../../../store/Snackbar.state";
import { downloadExcel } from "../../../util/downloadExcel";

function RenderStatus(props: GridRenderCellParams<any, string>) {
  const { value } = props;

  return <>{value && <StatusBar status={value} />}</>;
}

type BankListingTableProps = {
  onRowClick?: (data: { id: GridRowId; row: any }) => void;
};

export const BankListingActiveTable = ({
  onRowClick,
}: BankListingTableProps) => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 25,
  });
  const {
    mutate: getMemberVPosList,
    data: tableData,
    isLoading,
  } = useGetMemberVPosList();
  const { mutate: memberVPosUpdate } = useMemberVPosUpdate();
  const navigate = useNavigate();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState(0);
  const { mutate: memberVPosDelete, isLoading: isDeleteLoading } =
    useMemberVPosDelete();
  const setSnackbar = useSetSnackBar();

  useEffect(() => {
    getMemberVPosList(
      {
        size: paginationModel.pageSize,
        page: paginationModel.page,
        orderBy: "CreateDate",
        orderByDesc: true,
        status: "ACTIVE",
      },
      {
        onSuccess: (data) => {
          if (!data.isSuccess) {
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
    getMemberVPosList,
    paginationModel.page,
    paginationModel.pageSize,
    setSnackbar,
  ]);

  const editRow = React.useCallback(
    (memberVPos: IMemberVPos) => () => {
      navigate("/vpos-management/vpos-bankdefinition", { state: memberVPos });
    },
    [navigate]
  );

  const deleteRow = React.useCallback(
    (memberVPos: IMemberVPos) => () => {
      setIsDeleteModalOpen(true);
      setSelectedRowId(Number(memberVPos.id));
    },
    []
  );

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    const deleteRequest: DeleteMemberVPosRequest = { id: selectedRowId };

    memberVPosDelete(deleteRequest, {
      onSuccess: (data: any) => {
        if (data.isSuccess) {
          getMemberVPosList({
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
      { field: "bankName", headerName: "Banka Adı", width: 400 },
      {
        field: "createUserName",
        headerName: "Son Güncelleyen Kullanıcı",
        width: 220,
      },
      { field: "updateDate", headerName: "Son Güncelleme Tarihi", width: 300 },
      {
        renderCell: RenderStatus,
        field: "status",
        headerName: "Durum",
        width: 150,
      },
      {
        headerName: "Varsayılan",
        field: "actions",
        type: "actions",
        width: 120,
        getActions: (params) => {
          const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            const val = event.target.checked;
            memberVPosUpdate(
              {
                id: params.row.id,
                memberId: params.row.memberId,
                bankCode: params.row.bankCode,
                defaultBank: val,
                status: "ACTIVE",
              },
              {
                onSuccess: () => {
                  getMemberVPosList({
                    size: paginationModel.pageSize,
                    page: paginationModel.page,
                    orderBy: "CreateDate",
                    orderByDesc: true,
                    status: "ACTIVE",
                  });
                },
              }
            );
          };
          return [
            <Switch checked={params.row.defaultBank} onChange={handleChange} />,
          ];
        },
      },
      {
        field: "update",
        type: "actions",
        width: 80,
        getActions: (params) => {
          return [
            <GridActionsCellItem
              label="Düzenle"
              onClick={editRow(params.row)}
              showInMenu
            />,
            <GridActionsCellItem
              label="Sil"
              onClick={deleteRow(params.row)}
              showInMenu
            />,
          ];
        },
      },
    ];
  }, [
    deleteRow,
    editRow,
    getMemberVPosList,
    memberVPosUpdate,
    paginationModel.page,
    paginationModel.pageSize,
  ]);

  const handleChangePagination = (model: GridPaginationModel) => {
    setPaginationModel(model);

    getMemberVPosList(
      {
        size: paginationModel.pageSize,
        page: paginationModel.page,
        orderBy: "CreateDate",
        orderByDesc: true,
        status: "ACTIVE",
      },
      {
        onSuccess: (data) => {
          if (!data.isSuccess) {
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

  const onSave = () => {
    getMemberVPosList(
      {
        size: -1,
        page: 0,
        orderBy: "CreateDate",
        orderByDesc: true,
        status: "ACTIVE",
      },
      {
        onSuccess: (data) => {
          if (data.isSuccess) {
            downloadExcel(data?.data?.result || [], "Aktif Banka Listesi");
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

      <Stack flex={1} py={2}>
        {tableData?.data?.result && !hasLoading && (
          <>
            <Table
              paginationModel={paginationModel}
              onPaginationModelChange={handleChangePagination}
              paginationMode="server"
              rowCount={tableData?.data?.totalItems}
              sx={{ width: isDesktop ? 1308 : window.innerWidth - 50 }}
              onRowClick={onRowClick}
              isRowSelectable={() => false}
              disableColumnMenu
              rows={tableData?.data?.result.filter(
                (item) => item.status === "ACTIVE"
              )}
              columns={columns}
              exportFileName="Aktif Banka Listesi"
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
