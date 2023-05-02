import { useState } from "react";
import { GridRowId } from "@mui/x-data-grid";
import {
  AdminTemplate,
  RoleMenuAddModal,
  RoleMenuListingTable,
} from "../../components";

export const SettingsRoleMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [roleMenuData, setRoleMenuData] = useState<any>();

  const handleAddButton = () => setIsOpen(true);
  const handleRowClick = (data: { id: GridRowId; row: any }) => {
    setIsOpen(true);
    setRoleMenuData(data.row);
  };

  return (
    <AdminTemplate
      headerProps={{
        headerTitle: "Rol Menü Listesi",
        onClickAddButton: handleAddButton,
      }}
    >
      <RoleMenuListingTable onRowClick={handleRowClick} />
      {isOpen && (
        <RoleMenuAddModal
          roleMenu={roleMenuData}
          onClose={() => {
            setIsOpen(false);
            setRoleMenuData(undefined);
          }}
          title={"Role Menü Ekle"}
          isOpen={isOpen}
        />
      )}
    </AdminTemplate>
  );
};
