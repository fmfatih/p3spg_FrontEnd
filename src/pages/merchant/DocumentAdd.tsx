import { AdminTemplate, DocumentAddForm } from "../../components"

export const DocumentAdd = () => {
  return (
    <AdminTemplate
      headerProps={{
        headerTitle: 'Doküman Ekleme',
        hideAddButton: true,
        hideDownloadButton: true,
        hideSearchBar: true
      }}>
      <DocumentAddForm />
    </AdminTemplate>
  )
}
