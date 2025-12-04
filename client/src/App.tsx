import { useState } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";

import Header from "@/components/Header";
import HomepageHero from "@/components/HomepageHero";
import PopularItemsSection from "@/components/PopularItemsSection";
import WholesalePreviewSection from "@/components/WholesalePreviewSection";
import Footer from "@/components/Footer";
import RoleSelector, { type UserRole } from "@/components/RoleSelector";
import BuyerDashboard from "@/components/BuyerDashboard";
import SellerDashboard from "@/components/SellerDashboard";
import WholesalerDashboard from "@/components/WholesalerDashboard";
import PriceCompareModal from "@/components/PriceCompareModal";
import beansImage from "@assets/generated_images/beans_product_image.png";

function HomePage({ 
  onGetStarted, 
  onLogin 
}: { 
  onGetStarted: () => void; 
  onLogin: () => void;
}) {
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<{name: string; image: string} | null>(null);

  // todo: remove mock functionality
  const mockPriceOptions = [
    { sellerId: "s1", sellerName: "Fresh Mart", price: 1400, distance: "1.2 km", rating: 4.8, inStock: true },
    { sellerId: "s2", sellerName: "Grain Store", price: 1500, distance: "2.5 km", rating: 4.5, inStock: true },
    { sellerId: "s3", sellerName: "Agro Foods", price: 1450, distance: "1.8 km", rating: 4.6, inStock: true },
    { sellerId: "s4", sellerName: "Local Market", price: 1550, distance: "3.0 km", rating: 4.2, inStock: false },
  ];

  const handleCompare = (productId: string) => {
    setSelectedProduct({ name: "Premium Beans", image: beansImage });
    setCompareModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header onGetStarted={onGetStarted} onLogin={onLogin} />
      <main className="flex-1">
        <HomepageHero onGetStarted={onGetStarted} />
        <PopularItemsSection 
          onCompare={handleCompare}
          onBuyWithCash={(id) => console.log(`Buy with cash: ${id}`)}
        />
        <WholesalePreviewSection 
          onContact={(id) => console.log(`Contact: ${id}`)}
          onViewDetails={(id) => console.log(`View details: ${id}`)}
        />
      </main>
      <Footer />
      
      {selectedProduct && (
        <PriceCompareModal
          isOpen={compareModalOpen}
          onClose={() => setCompareModalOpen(false)}
          productName={selectedProduct.name}
          productImage={selectedProduct.image}
          priceOptions={mockPriceOptions}
          onSelectSeller={(id) => {
            console.log(`Selected seller: ${id}`);
            setCompareModalOpen(false);
          }}
        />
      )}
    </div>
  );
}

function App() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  // todo: remove mock functionality - replace with real auth state
  const [currentView, setCurrentView] = useState<"home" | "role-select" | "dashboard">("home");
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");

  const handleGetStarted = () => {
    setCurrentView("role-select");
  };

  const handleLogin = () => {
    setCurrentView("role-select");
  };

  const handleRoleSelect = (role: UserRole, isLogin: boolean) => {
    setUserRole(role);
    // todo: remove mock functionality - implement real auth
    const mockNames: Record<UserRole, string> = {
      buyer: "Chidi",
      seller: "Emeka", 
      wholesaler: "Adebayo"
    };
    setUserName(mockNames[role]);
    setIsLoggedIn(true);
    setCurrentView("dashboard");
    
    toast({
      title: isLogin ? "Welcome back!" : "Account created!",
      description: `You are now ${isLogin ? "logged in" : "signed up"} as a ${role}.`,
    });
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
    setUserName("");
    setCurrentView("home");
    
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  const handleBackToHome = () => {
    setCurrentView("home");
  };

  const renderDashboard = () => {
    switch (userRole) {
      case "buyer":
        return (
          <>
            <Header 
              isLoggedIn={true} 
              userName={userName}
              onDashboard={() => {}}
            />
            <BuyerDashboard 
              userName={userName} 
              userLocation="Lagos, Nigeria"
              onLogout={handleLogout}
            />
          </>
        );
      case "seller":
        return (
          <>
            <Header 
              isLoggedIn={true} 
              userName={userName}
              onDashboard={() => {}}
            />
            <SellerDashboard 
              userName={userName}
              onLogout={handleLogout}
            />
          </>
        );
      case "wholesaler":
        return (
          <>
            <Header 
              isLoggedIn={true} 
              userName={userName}
              onDashboard={() => {}}
            />
            <WholesalerDashboard 
              userName={userName}
              onLogout={handleLogout}
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        {currentView === "home" && (
          <HomePage 
            onGetStarted={handleGetStarted} 
            onLogin={handleLogin}
          />
        )}
        {currentView === "role-select" && (
          <RoleSelector 
            onSelectRole={handleRoleSelect}
            onBack={handleBackToHome}
          />
        )}
        {currentView === "dashboard" && renderDashboard()}
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
