import { AdminTemplate, MerchantAuthorizationForm } from "../../components"

export const MerchantAuthorization = () => {
  return (
    <AdminTemplate
      headerProps={{
        headerTitle: 'İşyeri Banka Yetkilendirme',
        hideAddButton: true,
        hideDownloadButton: true,
        hideSearchBar: true
      }}>
      <MerchantAuthorizationForm />
    </AdminTemplate>
  )
}
