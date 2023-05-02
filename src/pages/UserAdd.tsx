import { AdminTemplate, UserAddForm } from "../components";

export const UserAdd = () => {
  return (
    <AdminTemplate
      headerProps={{
        headerTitle: "Kullanıcı Tanımlama",
        hideAddButton: true,
        hideDownloadButton: true,
        hideSearchBar: true,
      }}
    >
      <UserAddForm />
    </AdminTemplate>
  );
};
