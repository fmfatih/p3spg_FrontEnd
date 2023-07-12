import { AdminTemplate, BankAddBulkCommissionUploadForm} from "../../components"

export const BankAddBulkCommissionUpload = () => {
  return (
    <AdminTemplate
      headerProps={{
        headerTitle: 'Toplu Komisyon Kodu Tanımı ve Güncelleme',
        hideAddButton: true,
        hideDownloadButton: true,
        hideSearchBar: true
      }}>
      <BankAddBulkCommissionUploadForm />
    </AdminTemplate>
  )
}
