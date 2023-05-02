import { AdminTemplate, BankAddCommissionProfileForm } from "../../components"

export const BankAddCommissionProfile = () => {
  return (
    <AdminTemplate
      headerProps={{
        headerTitle: 'Üye İş yeri Komisyon Profil Tanımlama',
        hideAddButton: true,
        hideDownloadButton: true,
        hideSearchBar: true
      }}>
      <BankAddCommissionProfileForm />
    </AdminTemplate>
  )
}
