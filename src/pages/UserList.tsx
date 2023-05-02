import { useNavigate } from "react-router-dom";
import { AdminTemplate, UserListingTable } from "../components";

export const UserList = () => {
  const navigate = useNavigate();
  const handleAddButton = () =>
    navigate("/user-management/user-identification");

  return (
    <AdminTemplate
      headerProps={{
        headerTitle: "Kullanıcı Listeleme",
        onClickAddButton: handleAddButton,
      }}
    >
      <UserListingTable />
    </AdminTemplate>
  );
};
