import { Button } from "@/components/ui/button";
import logoImage from "@assets/pocketfyt_1764767044825.png";

interface HeaderProps {
  onLogin?: () => void;
  onGetStarted?: () => void;
  isLoggedIn?: boolean;
  userName?: string;
  onDashboard?: () => void;
}

export default function Header({ 
  onLogin, 
  onGetStarted, 
  isLoggedIn = false, 
  userName,
  onDashboard 
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full bg-primary">
      <div className="container flex h-16 items-center justify-between gap-4 px-4 md:px-6">
        <div className="flex items-center gap-2">
          <img 
            src={logoImage} 
            alt="POCKETFYT" 
            className="h-10 w-auto"
            data-testid="img-logo"
          />
        </div>
        
        <div className="flex items-center">
          {isLoggedIn ? (
            <div className="flex items-center gap-3 bg-white/20 rounded-full px-2 py-1">
              <span className="text-sm text-white hidden sm:inline pl-2">
                Welcome, {userName}
              </span>
              <Button 
                onClick={onDashboard}
                className="bg-white text-primary hover:bg-white/90 rounded-full"
                data-testid="button-dashboard"
              >
                Dashboard
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-white/20 rounded-full p-1">
              <Button 
                variant="ghost"
                onClick={onLogin}
                className="text-white hover:bg-white/10 rounded-full"
                data-testid="button-login"
              >
                Login
              </Button>
              <Button 
                onClick={onGetStarted}
                className="bg-white text-primary hover:bg-white/90 rounded-full"
                data-testid="button-get-started-header"
              >
                Get Started
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
