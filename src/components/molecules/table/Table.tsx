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
  GridFilterModel,
} from "@mui/x-data-grid";
import InputLabel from "@mui/material/InputLabel";
import "./index.css";
import { downloadExcel } from "../../../util/downloadExcel";
import { Button } from "@mui/material";
import { FileDownloadOutlined, Clear } from "@mui/icons-material";
import React from "react";
import SearchIcon from "@mui/icons-material/Search";
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

export function FilterMenuIcon() {
  return <SearchIcon className="icon" />;
}

function CustomToolbar({
  onDownload,
  onClear,
}: {
  onDownload: any;
  onClear: any;
}) {
  return (
    <GridToolbarContainer sx={{ justifyContent: "flex-end" }}>
      {/* <GridToolbarQuickFilter></GridToolbarQuickFilter> */}
      <GridToolbarColumnsButton></GridToolbarColumnsButton>
      {/* <GridToolbarFilterButton></GridToolbarFilterButton> */}
      <Button onClick={()=> onClear()}>
        <Clear color="primary" />
        TEMİZLE
      </Button>
      <Button onClick={onDownload}>
        <FileDownloadOutlined color="primary " />
        İNDİR
      </Button>
    </GridToolbarContainer>
  );
}

export const Table = ({ handleFilterChange, ...props }: TableProps) => {
  const apiRef = useGridApiRef();
  const [filterr, setFilter] = React.useState({});
  const [model, setModel] = React.useState();

  const handleClear = () => {
    let props = "clearFilter"
    handleFilterChange(props);
  };

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
          if (fieldHeader) {
            filteredItem[fieldHeader[1]] = item[fieldHeader[0]];
          }
        });

        return filteredItem;
      });

    downloadExcel(array, props?.exportFileName);
  };

  const onFilterChange = React.useCallback((filterModel: GridFilterModel) => {
    localStorage.setItem("filterModel", filterModel);
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

  React.useEffect(() => {
    const storedFilters = localStorage.getItem("filters");
    if (storedFilters) {
      const filtersObject = JSON.parse(storedFilters);
      setModel((currentModel) => ({
        ...currentModel,
        ...filtersObject,
      }));
    }
  }, []);

  const handleColumnVisibilityChange = (newProps) => {
    setModel((currentModel) => {
      const updatedModel = {
        ...currentModel,
        ...newProps,
      };
      localStorage.setItem("filters", JSON.stringify(updatedModel));
      return updatedModel;
    });
  };

  // const filterModel = JSON.parse(localStorage.getItem('filterModel'));

  // if(filterModel) {
  //   setFilter(filterModel)
  // }
  const [key, setKey] = React.useState(Math.random());

  return (
    <DataGrid
      {...props}
      key={key}
      apiRef={apiRef}
      disableDensitySelector={true}
      filterMode="server"
      // initialState={{
      //   filter: {
      //     filterModel: {
      //       items: [{ field: 'issuerCardBankName',  value: 'test' }],
      //     },
      //   },
      // }}
      onFilterModelChange={onFilterChange}
      slots={{
        toolbar: () =>
          CustomToolbar({ onDownload: props.onSave, onClear: handleClear }),
        columnMenuIcon: FilterMenuIcon,
      }}
      localeText={{
        toolbarColumns: "Kolonlar",
        columnMenuFilter: "Filtre",
        filterPanelColumns:"Kolon",
        filterPanelInputPlaceholder:"Değer Ara",
        filterPanelOperator: "Operatör",
        filterOperatorContains: "İçerir",
        filterOperatorEquals: "Eşittir",
        filterOperatorStartsWith: "İle Başlar",
        filterOperatorEndsWith: "İle Biter",
        filterOperatorIsEmpty: "Boştur",
        filterOperatorIsNotEmpty: "Boş Değildir",
        filterOperatorIsAnyOf: "Herhangi Biri",
        filterPanelInputLabel:"Değer",
        columnMenuHideColumn: "Gizle",
        columnMenuManageColumns: "Kolonlar",
        columnMenuSortAsc: "Artan Sırala",
        columnMenuSortDesc: "Azalan Sırala",
        columnsPanelShowAllButton: "Tümünü Göster",
        columnsPanelHideAllButton: "Gizle",
        columnsPanelTextFieldLabel: "Kolon Ara",
        columnsPanelTextFieldPlaceholder: "Kolon Başlığı",
        toolbarExport: "İndir",
        toolbarExportCSV: "Excel olarak indir",
        toolbarExportPrint: "Yazdır",
        noRowsLabel: "Veri bulunamadı", 
        toolbarFilters: "Ara",
        MuiTablePagination: {
          labelRowsPerPage: "Sayfa Başına Satır",
          labelDisplayedRows: ({ from, to, count }) =>
          `${from}/${to} (${count} veri)`,
        },

      }}
      columnVisibilityModel={model}
      onColumnVisibilityModelChange={handleColumnVisibilityChange}
    ></DataGrid>
  );
};
