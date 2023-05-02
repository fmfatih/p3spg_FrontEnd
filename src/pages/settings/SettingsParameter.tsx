import { IParameter } from "@/hooks";
import { GridRowId } from "@mui/x-data-grid";
import { useState } from "react";
import {
  AdminTemplate,
  ParameterAddModal,
  ParameterListingTable,
} from "../../components";

export const SettingsParameter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<IParameter>();

  const handleAddButton = () => setIsOpen(true);

  const handleRowClick = (data: { id: GridRowId; row: IParameter }) => {
    setIsOpen(true);
    setData(data.row);
  };

  return (
    <AdminTemplate
      headerProps={{
        headerTitle: "Parametre Listesi",
        onClickAddButton: handleAddButton,
      }}
    >
      <ParameterListingTable isModalOpen={isOpen} onRowClick={handleRowClick} />
      <ParameterAddModal
        parameter={data}
        onClose={() => {
          setIsOpen(false);
          setData(undefined);
        }}
        title={"Yeni Parametre Ekle"}
        isOpen={isOpen}
      />
    </AdminTemplate>
  );
};
