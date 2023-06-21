import { AdminTemplate, DocumentAddForm } from "../../components"

export const DocumentAdd = () => {
  return (
    <AdminTemplate
      headerProps={{
        headerTitle: 'Döküman Yükle',
        hideAddButton: true,
        hideDownloadButton: true,
        hideSearchBar: true
      }}>
      <DocumentAddForm />
    </AdminTemplate>
  )
}
