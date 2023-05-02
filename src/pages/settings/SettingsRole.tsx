import { IRole } from "@/hooks";
import { GridRowId } from "@mui/x-data-grid";
import { useState } from "react";
import { AdminTemplate, RoleAddModal, RoleListingTable } from "../../components"

export const SettingsRole = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [roleData, setRoleData] = useState<IRole>();

  const handleAddButton = () => setIsOpen(true)

  const handleRowClick = (data: {
    id: GridRowId;
    row: IRole;
  }) => {
    setIsOpen(true);
    setRoleData(data.row);
  }

  return (
    <AdminTemplate headerProps={{headerTitle: 'Rol Listesi', onClickAddButton: handleAddButton}}>
      <RoleListingTable isModalClosed={isOpen} onRowClick={handleRowClick}/>
      <RoleAddModal role={roleData}  onClose={() => {
        setIsOpen(false);
        setRoleData(undefined);
      }} title={"Yeni Rol Ekle"} isOpen={isOpen}/>
    </AdminTemplate>
  )
}
