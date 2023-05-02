import { AdminTemplate, MerchantAddForm } from "../../components"

export const MerchantAdd = () => {
  return (
    <AdminTemplate
      headerProps={{
        headerTitle: 'İşyeri Tanımlama',
        hideAddButton: true,
        hideDownloadButton: true,
        hideSearchBar: true
      }}>
      <MerchantAddForm />
    </AdminTemplate>
  )
}
