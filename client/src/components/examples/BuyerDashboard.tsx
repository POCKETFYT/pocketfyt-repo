import BuyerDashboard from "../BuyerDashboard";

export default function BuyerDashboardExample() {
  return (
    <BuyerDashboard
      userName="Chidi"
      userLocation="Ikeja, Lagos"
      onLogout={() => console.log("Logout clicked")}
    />
  );
}
