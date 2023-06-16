import { useNavigate } from "react-router-dom";
import {
  AdminTemplate,
  BankCommissionListingProfileTable,
} from "../../components";

export const BankCommissionProfileList = () => {
  const navigate = useNavigate();

  const handleAddButton = () =>
    navigate("/commission-management/commission-codedefinition-detail");
  return (
    <AdminTemplate
      headerProps={{
        headerTitle: "Komisyon Profil Kodu Tanımlama Listesi",
        onClickAddButton: handleAddButton,
      }}
    >
      <BankCommissionListingProfileTable />
    </AdminTemplate>
  );
};
