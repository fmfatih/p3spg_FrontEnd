import { AdminTemplate, BankAddForm } from "../../components"

export const BankAdd = () => {
  return (
    <AdminTemplate
      headerProps={{
        headerTitle: 'Banka Tanımlama',
        hideAddButton: true,
        hideDownloadButton: true,
        hideSearchBar: true
      }}>
      <BankAddForm />
    </AdminTemplate>
  )
}