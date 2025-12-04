import SellerDashboard from "../SellerDashboard";

export default function SellerDashboardExample() {
  return (
    <SellerDashboard
      userName="Emeka"
      onLogout={() => console.log("Logout clicked")}
    />
  );
}
