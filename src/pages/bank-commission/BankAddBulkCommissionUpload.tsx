import { AdminTemplate, BankAddBulkCommissionUploadForm} from "../../components"

export const BankAddBulkCommissionUpload = () => {
  return (
    <AdminTemplate
      headerProps={{
        headerTitle: 'Toplu Komisyon Yükleme',
        hideAddButton: true,
        hideDownloadButton: true,
        hideSearchBar: true
      }}>
      <BankAddBulkCommissionUploadForm />
    </AdminTemplate>
  )
}
