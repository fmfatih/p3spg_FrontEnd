import { AdminTemplate, BankAddCommissionProfileForm } from "../../components"

export const BankAddCommissionProfile = () => {
  return (
    <AdminTemplate
      headerProps={{
        headerTitle: 'Komisyon Profil Kodu Tanımlama',
        hideAddButton: true,
        hideDownloadButton: true,
        hideSearchBar: true
      }}>
      <BankAddCommissionProfileForm />
    </AdminTemplate>
  )
}
