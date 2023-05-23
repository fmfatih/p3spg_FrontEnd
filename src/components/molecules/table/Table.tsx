// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/* eslint-disable jsx-a11y/anchor-is-valid */
import {
  DataGrid,
  DataGridProps,
  GridSlotsComponentsProps,
  GridToolbarContainer,
  GridToolbarFilterButton,
  useGridApiRef,
  gridExpandedSortedRowIdsSelector,
  GridColumnHeaderFilterIconButton,
  GridToolbarColumnsButton,
  GridToolbarQuickFilter,
  SearchBar,
  GridLogicOperator,
  GridFilterPanel,
  GridColumnMenuFilterItem,
} from "@mui/x-data-grid";
import InputLabel from "@mui/material/InputLabel";
import "./index.css";
import { downloadExcel } from "../../../util/downloadExcel";
import { Button } from "@mui/material";
import { FileDownloadOutlined, Filter } from "@mui/icons-material";
import React from "react";

export type TableProps = DataGridProps & {
  components?: GridSlotsComponentsProps;
  onDownload?: () => void;
  exportFileName?: string;
  onSave?: () => any;
};

interface IColumn {
  headerName?: string;
  field: string;
}

function CustomToolbar({ onDownload }: { onDownload: any }) {
  return (
    <GridToolbarContainer sx={{ justifyContent: "flex-end" }}>
      {/* <GridToolbarQuickFilter></GridToolbarQuickFilter> */}
      <GridToolbarColumnsButton></GridToolbarColumnsButton>
      {/* <GridToolbarFilterButton></GridToolbarFilterButton> */}
      <Button onClick={onDownload}>
        <FileDownloadOutlined color="primary " />
        İNDİR
      </Button>
    </GridToolbarContainer>
  );
}

export const Table = ({ handleFilterChange, ...props }: TableProps) => {
  const apiRef = useGridApiRef();
  const handleDownload = () => {
    const filteredGridIds = gridExpandedSortedRowIdsSelector(apiRef);
    const fieldHeaderNameTuple = props.columns.map((column: IColumn) => {
      if (column.headerName) {
        return [column.field, column.headerName];
      }
    });

    const array = props.rows
      .filter((row) => filteredGridIds.includes(row.id))
      .map((item) => {
        const filteredItem = {};
        fieldHeaderNameTuple.map((fieldHeader) => {
          console.log(fieldHeader);
          if (fieldHeader) {
            filteredItem[fieldHeader[1]] = item[fieldHeader[0]];
          }
        });

        return filteredItem;
      });

    downloadExcel(array, props?.exportFileName);
  };

  const onFilterChange = React.useCallback((filterModel: GridFilterModel) => {
    // Here you save the data you need from the filter model
    let request;
    const value = filterModel?.items[0]?.value;
    request = value
      ? {
          field: filterModel?.items[0]?.field,
          value: filterModel?.items[0]?.value,
        }
      : {};

    handleFilterChange(request);
  }, []);

  const [model, setModel] = React.useState();

  React.useEffect(() => {
    const storedFilters = localStorage.getItem('filters');
    if (storedFilters) {
      const filtersObject = JSON.parse(storedFilters);
      setModel(currentModel => ({
        ...currentModel,
        ...filtersObject,
      }));
    }
  }, []); 

  const handleColumnVisibilityChange = (newProps) => {
    setModel(currentModel => {
      const updatedModel = {
        ...currentModel,
        ...newProps
      };
      localStorage.setItem('filters', JSON.stringify(updatedModel));
      return updatedModel;
    });
  };



  return (
    <DataGrid
      {...props}
      apiRef={apiRef}
      // disableDensitySelector
      filterMode="server"
      onFilterModelChange={onFilterChange}
      slots={{
        toolbar: () => CustomToolbar({ onDownload: props.onSave }),
      }}
      localeText={{
        toolbarColumns: "Kolonlar",
        columnsPanelShowAllButton: "Tümünü Göster",
        columnsPanelHideAllButton: "Gizle",
        columnsPanelTextFieldLabel: "Kolon Ara",
        columnsPanelTextFieldPlaceholder: "Kolon Başlığı",
        toolbarExport: "İndir",
        toolbarExportCSV: "Excel olarak indir",
        toolbarExportPrint: "Yazdır",
        toolbarFilters: "Ara",
        MuiTablePagination: {
          labelRowsPerPage: "Sayfa Başına Satır",
        },
      }}
      columnVisibilityModel={model}
      onColumnVisibilityModelChange={handleColumnVisibilityChange}
    ></DataGrid>
  );
};
