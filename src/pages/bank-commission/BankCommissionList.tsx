import { useNavigate } from "react-router-dom";
import { AdminTemplate, BankCommissionListingTable } from "../../components";

export const BankCommissionList = () => {
  const navigate = useNavigate();

  const handleAddButton = () => navigate("/commission-management/commission-definition");

  return (
    <AdminTemplate
      headerProps={{
        headerTitle: "Banka Komisyon Listeleme",
        onClickAddButton: handleAddButton,
      }}
    >
      <BankCommissionListingTable onRowClick={({ id }) => {}} />
    </AdminTemplate>
  );
};
