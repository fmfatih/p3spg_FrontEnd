import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminTemplate, BankListing, BankListingModal } from "../../components";

export const BankList = () => {
  const navigate = useNavigate();

  const handleAddButton = () =>
    navigate("/vpos-management/vpos-bankdefinition");

  return (
    <AdminTemplate
      headerProps={{
        headerTitle: "Banka Listeleme",
        onClickAddButton: handleAddButton,
      }}
    >
      <BankListing/>
    </AdminTemplate>
  );
};
