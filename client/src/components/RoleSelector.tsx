import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Store, Warehouse, LogIn } from "lucide-react";

export type UserRole = "buyer" | "seller" | "wholesaler";

interface RoleSelectorProps {
  onSelectRole: (role: UserRole, isLogin: boolean) => void;
  onBack?: () => void;
}

export default function RoleSelector({ onSelectRole, onBack }: RoleSelectorProps) {
  const roles = [
    {
      role: "buyer" as UserRole,
      title: "Buyer",
      description: "Find the best prices from sellers near you",
      icon: ShoppingCart,
      signUpText: "Sign up as Buyer",
      loginText: "Login as Buyer",
    },
    {
      role: "seller" as UserRole,
      title: "Seller",
      description: "Sell your products to customers in your area",
      icon: Store,
      signUpText: "Sign up as Seller",
      loginText: "Login as Seller",
    },
    {
      role: "wholesaler" as UserRole,
      title: "Wholesaler",
      description: "Sell in bulk to buyers across the country",
      icon: Warehouse,
      signUpText: "Sign up as Wholesaler",
      loginText: "Login as Wholesaler",
    },
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Select your role</h1>
          <p className="text-muted-foreground">
            Choose how you want to use POCKETFYT
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {roles.map(({ role, title, description, icon: Icon, signUpText, loginText }) => (
            <Card key={role} className="relative overflow-visible hover-elevate">
              <CardHeader className="text-center pb-2">
                <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl">{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  className="w-full"
                  onClick={() => onSelectRole(role, false)}
                  data-testid={`button-signup-${role}`}
                >
                  {signUpText}
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => onSelectRole(role, true)}
                  data-testid={`button-login-${role}`}
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  {loginText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {onBack && (
          <div className="text-center mt-8">
            <Button variant="ghost" onClick={onBack} data-testid="button-back">
              Back to Home
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
