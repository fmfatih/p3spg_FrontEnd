import { useNavigate } from "react-router-dom";
import { AdminTemplate, BankRedirectListingTable } from "../../components";

export const BankRedirectList = () => {
  const navigate = useNavigate();

  const handleAddButton = () => navigate("/vpos-management/vpos-bankrouting");

  return (
    <AdminTemplate
      headerProps={{
        headerTitle: "Sanal Pos Banka Yönlendirme Listesi",
        onClickAddButton: handleAddButton,
      }}
    >
      <BankRedirectListingTable />
    </AdminTemplate>
  );
};
