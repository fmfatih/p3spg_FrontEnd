import { createBrowserRouter } from "react-router-dom";
import {
  MerchantAuthorization,
  UserList,
  Login,
  Dashboard,
  UserAdd,
  MerchantList,
  MerchantAdd,
  BankAdd,
  BankList,
  BankCommissionList,
  BankAddCommission,
  BankAddCommissionProfile,
  SettingsMenu,
  SettingsRole,
  SettingsMessage,
  SettingsRoleMenu,
  BankRedirectList,
  BankRedirectAdd,
  PaymentAndTransaction,
  CampaignList,
  CampaignAdd,
  PreAuthAdd,
  PreAuthSalesAdd,
  SettingsParameter,
  SettingsNonsecure,
  PaymentWithLinked,
  PaymentWithLinkedList,
  BusinessBankListing,
  MerchantEndOfDay,
  BankPayment,
  BankCommissionProfileList,
  DocumentAdd,
  BankAddBulkCommissionUpload,
} from "../pages";




export const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/user-management/user-listing",
    element: <UserList />,
  },
  {
    path: "/user-management/user-identification",
    element: <UserAdd />,
  },
  {
    path: "/merchant-management/merchant-listing",
    element: <MerchantList />,
  },
  {
    path: "/merchant-management/merchant-identification",
    element: <MerchantAdd />,
  },
  {
    path: "/merchant-management/document-add",
    element: <DocumentAdd />,
  },
  {
    path: "/merchant-management/merchant-bankdefinition",
    element: <MerchantAuthorization />,
  },
  {
    path: "/vpos-management/vpos-banklisting",
    element: <BankList />,
  },
  {
    path: "/vpos-management/vpos-bankdefinition",
    element: <BankAdd />,
  },
  {
    path: "/vpos-management/banklisting",
    element: <BankRedirectList />,
  },
  {
    path: "/vpos-management/vpos-bankrouting",
    element: <BankRedirectAdd />,
  },
  {
    path: "/commission-management/commission-listing",
    element: <BankCommissionList />,
  },
  {
    path: "/commission-management/commission-alldefination",
    element: <BankAddBulkCommissionUpload/>,
  },
  {
    path: "/vpos-management/vpos-merchantbanklisting",
    element: <BusinessBankListing />,
  },
  {
    path: "/commission-management/commission-definition",
    element: <BankAddCommission />,
  },
  {
    path: "/commission-management/commission-codedefinition",
    element: <BankCommissionProfileList />,
  },
  {
    path: "/commission-management/commission-codedefinition-detail",
    element: <BankAddCommissionProfile />,
  },
  {
    path: "/setting-management/setting-menu",
    element: <SettingsMenu />,
  },
  {
    path: "/setting-management/setting-rol",
    element: <SettingsRole />,
  },
  {
    path: "/setting-management/setting-rolmenu",
    element: <SettingsRoleMenu />,
  },
  {
    path: "/setting-management/setting-source",
    element: <SettingsMessage />,
  },
  {
    path: "/setting-management/setting-parameter",
    element: <SettingsParameter />,
  },
  {
    path: "/setting-management/setting-nonsecure",
    element: <SettingsNonsecure />,
  },
  {
    path: "/campaign-management/campaign-listing",
    element: <CampaignList />,
  },
  {
    path: "/campaign-management/campaign-definition",
    element: <CampaignAdd />,
  },
  {
    path: "/manuel-transactions/manuel-preauth",
    element: <PreAuthAdd />,
  },
  {
    path: "/manuel-transactions/manuel-auth",
    element: <PreAuthSalesAdd />,
  },
  {
    path: "/reporting/payment-reporting",
    element: <PaymentAndTransaction />,
  },
  {
    path: "/reporting/merchant-payment",
    element: <MerchantEndOfDay />,
  },
  {
    path: "/reporting/bank-payment",
    element: <BankPayment/>,
  },

  {
    path: "/manuel-transactions/link-payment",
    element: <PaymentWithLinked />,
  },
  {
    path: "/manuel-transactions/link-listing",
    element: <PaymentWithLinkedList />,
  },
]);
