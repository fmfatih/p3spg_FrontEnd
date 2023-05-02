import { IMenu } from "../../hooks";
import { useState } from "react";
import { AdminTemplate, MenuListingTable, MenuAddModal } from "../../components"
import { GridRowId } from "@mui/x-data-grid";

export const SettingsMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [menuData, setMenuData] = useState<IMenu>();
  const handleAddButton = () => setIsOpen(true);

  const handleRowClick = (data: {
    id: GridRowId;
    row: IMenu;
  }) => {
    setIsOpen(true);
    setMenuData(data.row);
  }

  return (
    <AdminTemplate headerProps={{headerTitle: 'Menü Listesi', onClickAddButton: handleAddButton}}>
      <MenuListingTable isMenuOpen={isOpen} onRowClick={handleRowClick}/>
      {isOpen && <MenuAddModal menu={menuData} isOpen={isOpen} onClose={() => {
        setMenuData(undefined);
        setIsOpen(false)
      }} title={"Yeni Menü Ekle"}/>}
    </AdminTemplate>
  )
}
