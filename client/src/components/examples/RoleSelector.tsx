import RoleSelector from "../RoleSelector";

export default function RoleSelectorExample() {
  return (
    <RoleSelector
      onSelectRole={(role, isLogin) => console.log(`Selected ${role}, login: ${isLogin}`)}
      onBack={() => console.log("Back clicked")}
    />
  );
}
