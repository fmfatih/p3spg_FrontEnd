import { IResource } from "@/hooks";
import { GridRowId } from "@mui/x-data-grid";
import { useState } from "react";
import { AdminTemplate, MessageListingTable, MessageAddModal } from "../../components"

export const SettingsMessage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messageData, setMessageData] = useState<IResource>();

  const handleAddButton = () => setIsOpen(true);
  
  const handleRowClick = (data: {
    id: GridRowId;
    row: IResource;
  }) => {
    setIsOpen(true);
    setMessageData(data.row);
  }
  
  return (
    <AdminTemplate headerProps={{headerTitle: 'Mesaj Yönetimi', onClickAddButton: handleAddButton}}>
      <MessageListingTable isModalOpen={isOpen} onRowClick={handleRowClick}/>
      {isOpen && <MessageAddModal message={messageData} isOpen={isOpen} onClose={() => {
        setIsOpen(false);
        setMessageData(undefined);
      }} title={"Mesaj Ekle"}/>}
    </AdminTemplate>
  )
}
