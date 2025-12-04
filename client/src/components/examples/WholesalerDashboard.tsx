import WholesalerDashboard from "../WholesalerDashboard";

export default function WholesalerDashboardExample() {
  return (
    <WholesalerDashboard
      userName="Adebayo"
      onLogout={() => console.log("Logout clicked")}
    />
  );
}
