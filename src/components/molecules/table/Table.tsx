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
} from "@mui/x-data-grid";
import InputLabel from "@mui/material/InputLabel";
import "./index.css";
import { downloadExcel } from "../../../util/downloadExcel";
import { Button } from "@mui/material";
import { FileDownloadOutlined } from "@mui/icons-material";

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

export const Table = ({...props }: TableProps) => {
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
          if (fieldHeader) {
            filteredItem[fieldHeader[1]] = item[fieldHeader[0]];
          }
        });

        return filteredItem;
      });

    downloadExcel(array, props?.exportFileName);
  };

  return (
    <DataGrid
      {...props}
      apiRef={apiRef}
      slots={{
        toolbar: () => CustomToolbar({onDownload: props.onSave }),
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
    ></DataGrid>
  );
};
