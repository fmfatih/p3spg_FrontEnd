import { INonsecure } from "../../hooks";
import { GridRowId } from "@mui/x-data-grid";
import { useState } from "react";
import {
  AdminTemplate,
  NonsecureAddModal,
  NonsecureListingTable,
} from "../../components";

export const SettingsNonsecure = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [nonsecureData, setNonsecureData] = useState<INonsecure>();

  const handleAddButton = () => setIsOpen(true);

  const handleRowClick = (data: { id: GridRowId; row: INonsecure }) => {
    setIsOpen(true);
    setNonsecureData(data.row);
  };

  return (
    <AdminTemplate
      headerProps={{
        headerTitle: "Nonsecure Tanımlama",
        onClickAddButton: handleAddButton,
      }}
    >
      <NonsecureListingTable isModalOpen={isOpen} onRowClick={handleRowClick} />
      <NonsecureAddModal
        nonsecureData={nonsecureData}
        onClose={() => {
          setIsOpen(false);
          setNonsecureData(undefined);
        }}
        title={"Nonsecure Tanımlama"}
        isOpen={isOpen}
      />
    </AdminTemplate>
  );
};
