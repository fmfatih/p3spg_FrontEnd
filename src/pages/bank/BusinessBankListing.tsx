import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminTemplate, BusinessBankList, BankListingModal } from "../../components";

export const BusinessBankListing = () => {
  const navigate = useNavigate();

  const handleAddButton = () =>
    navigate("/vpos-management/vpos-bankdefinition");

  return (
    <AdminTemplate
      headerProps={{
        headerTitle: "İşyeri Banka Listeleme",
        onClickAddButton: handleAddButton,
      }}
    >
      <BusinessBankList/>

    </AdminTemplate>
  );
};
