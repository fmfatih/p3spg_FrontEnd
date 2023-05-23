// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/* eslint-disable jsx-a11y/anchor-is-valid */

import React, { useEffect, useMemo, useState } from 'react';
import { Stack, useMediaQuery, useTheme } from '@mui/material';
import { GridColDef, GridActionsCellItem, GridPaginationModel } from '@mui/x-data-grid';
import { DeleteConfirmModal, Table } from '../../molecules';
import { Loading } from '../../atoms';
import {
  DeleteMerchantRequest,
  IMerchant,
  IVPosRouting,
  useAuthorization,
  useDeleteVPosRouting,
  useGetVPosRoutingList,
} from '../../../hooks';
import { useNavigate } from 'react-router-dom';
import { useSetSnackBar } from '../../../store/Snackbar.state';
import { PagingResponse } from '../../../hooks/_types';
import { downloadExcel } from '../../../util/downloadExcel';
import SearchTable from '../../../components/atoms/SearchTable';

export const BankRedirectListingTable = () => {
  const [text, setText] = useState('');
  const [queryOptions, setQueryOptions] = React.useState({});

  const theme = useTheme();
  const { showDelete, showUpdate } = useAuthorization();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const navigate = useNavigate();
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 25,
    searchText: null,
  });
  const { data: vposRoutingListResponse, mutate: getVPosRoutingList, isLoading } = useGetVPosRoutingList();
  const tableData = vposRoutingListResponse?.data;

  const editRow = React.useCallback(
    (vPosRouting: IVPosRouting) => () => {
      navigate('/vpos-management/vpos-bankrouting', { state: vPosRouting });
    },
    [navigate]
  );

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState(0);
  const setSnackbar = useSetSnackBar();
  const { mutate: vPosRoutingDelete, isLoading: isDeleteLoading } = useDeleteVPosRouting();

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
  useEffect(() => {
    const requestPayload = {
      size: text ? -1 : paginationModel.pageSize,
      page: paginationModel.page,
      orderBy: 'CreateDate',
      orderByDesc: true,
      searchText: text,
    };
  
    if (queryOptions?.field && queryOptions?.value !== undefined) {
      requestPayload[queryOptions.field] = queryOptions.value;
    }
  
    getVPosRoutingList(requestPayload, {
      onSuccess: (data) => {
        if (!data.isSuccess) {
          setSnackbar({
            severity: 'error',
            description: data.message,
            isOpen: true,
          });
        }
      },
      onError: () => {
        setSnackbar({
          severity: 'error',
          description: 'İşlem sırasında bir hata oluştu',
          isOpen: true,
        });
      },
    });
  }, [getVPosRoutingList, paginationModel.page, paginationModel.pageSize, setSnackbar, queryOptions]);
  

  // , queryOptions 

  const handleChangePagination = (model: GridPaginationModel) => {
    setPaginationModel(model);

    getVPosRoutingList(
      {
        size: text ? -1 : paginationModel.pageSize,
        page: paginationModel.page,
        orderBy: 'CreateDate',
        orderByDesc: true,
        searchText: text,
      },
      {
        onSuccess: (data) => {
          if (!data.isSuccess) {
            setSnackbar({
              severity: 'error',
              description: data.message,
              isOpen: true,
            });
          }
        },
        onError: () => {
          setSnackbar({
            severity: 'error',
            description: 'İşlem sırasında bir hata oluştu',
            isOpen: true,
          });
        },
      }
    );
  };

  const handleDeleteConfirm = () => {
    const deleteRequest: DeleteMerchantRequest = { id: selectedRowId };

    vPosRoutingDelete(deleteRequest, {
      onSuccess: (data: any) => {
        if (data.isSuccess) {
          getVPosRoutingList({
            size: text ? -1 : paginationModel.pageSize,
            page: paginationModel.page,
            orderBy: 'CreateDate',
            orderByDesc: true,
            searchText: text,
          });
          setSnackbar({
            severity: 'success',
            isOpen: true,
            description: data.message,
          });
        } else {
          setSnackbar({
            severity: 'error',
            description: data.message,
            isOpen: true,
          });
        }
      },
      onError: () => {
        setSnackbar({
          severity: 'error',
          description: 'İşlem sırasında bir hata oluştu',
          isOpen: true,
        });
      },
    });

    handleCloseDeleteModal();
  };
  const columns: GridColDef[] = useMemo(() => {
    return [
      {
        field: 'Aksiyonlar',
        type: 'actions',
        width: 80,
        getActions: (params) => {
          return [
            !!showUpdate ? <GridActionsCellItem label="Düzenle" onClick={editRow(params.row)} showInMenu /> : <></>,
            !!showDelete ? <GridActionsCellItem label="Sil" onClick={deleteRow(params.row)} showInMenu /> : <></>,
          ];
        },
      },
      {
        field: 'issuerCardBankName',
        headerName: 'Yönlendirelecek Kartın Bankası',
        width: 350,
      },
      {
        field: 'merchantVposBankName',
        headerName: 'Yönlendirelecek Sanal Pos',
        width: 350,
      },
      {
        field: 'merchantId',
        headerName: 'Üye İşyeri Numarası',
        width: 200,
      },
      {
        field: 'merchantName',
        headerName: 'Üye İşyeri Adı',
        width: 380,
      },
      {
        field: 'status',
        headerName: 'Statü',
        width: 100,
      },
      {
        field: 'createDate',
        headerName: 'Düzenlenme Tarihi',
        width: 200,
      },
      { field: 'createUserName', headerName: 'Düzenleyen', width: 200 },
    ];
  }, [deleteRow, editRow, showDelete, showUpdate]);

  const onSave = () => {
    getVPosRoutingList(
      {
        size: -1,
        page: 0,
        orderBy: 'CreateDate',
        orderByDesc: true,
      },
      {
        onSuccess: (data) => {
          if (data.isSuccess) {
            downloadExcel(data?.data?.result || [], 'Sanal Pos Banka Listesi');
          } else {
            setSnackbar({
              severity: 'error',
              description: data.message,
              isOpen: true,
            });
          }
        },
        onError: () => {
          setSnackbar({
            severity: 'error',
            description: 'İşlem sırasında bir hata oluştu',
            isOpen: true,
          });
        },
      }
    );
  };

  const hasLoading = isLoading || isDeleteLoading;

  // const handleChange = (newText) => {
  //   setText(newText);
  //   // Burada, debounced giriş işlemi yapılabilir.
  // };
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
    if (props.value?.toString()?.length >= 1) {
      setQueryOptions(props);
    }
  }, 500);

  // const handleFilterChange = (props:any) => {
  //   if(props.value?.toString()?.length > 3){
  //     setQueryOptions(props)
  //   }



  // }

console.log(queryOptions)

  return (
    <>
      {hasLoading && <Loading />}
      <Stack flex={1} p={2}>
        {tableData?.result && (
          <>
            {/* <div style={{ marginBottom: '10px' }}>
              <SearchTable value={text} onChange={handleChange} delay={500} />
            </div> */}
            <Table
              handleFilterChange={handleFilterChange}
              paginationModel={paginationModel}
              onPaginationModelChange={handleChangePagination}
              paginationMode="server"
              rowCount={tableData.totalItems}
              sx={{ width: isDesktop ? 1308 : window.innerWidth - 50 }}
              isRowSelectable={() => false}
              // disableColumnMenu
              rows={tableData.result}
              columns={columns}
              exportFileName="Sanal Pos Banka Listesi"
              onSave={() => onSave()}
            />
            <DeleteConfirmModal
              isOpen={isDeleteModalOpen}
              onClose={handleCloseDeleteModal}
              onConfirm={() => handleDeleteConfirm()}></DeleteConfirmModal>
          </>
        )}
      </Stack>
    </>
  );
};
