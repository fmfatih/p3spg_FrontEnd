import { AdminTemplate, BankAddBulkCommissionUploadForm} from "../../components"

export const BankAddBulkCommissionUpload = () => {
  return (
    <AdminTemplate
      headerProps={{
        headerTitle: 'Toplu Komisyon Kodu Tanımı',
        hideAddButton: true,
        hideDownloadButton: true,
        hideSearchBar: true
      }}>
      <BankAddBulkCommissionUploadForm />
    </AdminTemplate>
  )
}
