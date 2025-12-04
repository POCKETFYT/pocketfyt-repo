import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  MapPin, 
  Heart, 
  Bell, 
  TrendingUp,
  Filter,
  Package
} from "lucide-react";
import RetailProductCard from "./RetailProductCard";
import WholesaleProductCard from "./WholesaleProductCard";
import beansImage from "@assets/generated_images/beans_product_image.png";
import riceImage from "@assets/generated_images/rice_product_image.png";
import breadImage from "@assets/generated_images/bread_product_image.png";
import pizzaImage from "@assets/generated_images/pizza_product_image.png";
import drinksImage from "@assets/generated_images/drinks_crate_product_image.png";

interface BuyerDashboardProps {
  userName?: string;
  userLocation?: string;
  onLogout?: () => void;
}

export default function BuyerDashboard({ 
  userName = "John",
  userLocation = "Lagos, Nigeria",
  onLogout
}: BuyerDashboardProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("nearby");

  // todo: remove mock functionality - replace with real API data
  const nearbyProducts = [
    { id: "1", name: "Premium Beans", price: 1500, image: beansImage, distance: "1.2 km", sellerName: "Fresh Mart" },
    { id: "2", name: "Local Rice", price: 1800, image: riceImage, distance: "2.5 km", sellerName: "Grain Store" },
    { id: "3", name: "Fresh Bread", price: 800, image: breadImage, distance: "0.8 km", sellerName: "Bakery Plus" },
    { id: "4", name: "Pepperoni Pizza", price: 3500, image: pizzaImage, distance: "3.1 km", sellerName: "Pizza House" },
    { id: "5", name: "Honey Beans", price: 1600, image: beansImage, distance: "1.8 km", sellerName: "Agro Foods" },
    { id: "6", name: "Basmati Rice", price: 2200, image: riceImage, distance: "4.0 km", sellerName: "Rice World" },
  ];

  const popularProducts = [
    { id: "p1", name: "Ofada Rice", price: 2000, image: riceImage, distance: "5.2 km", sellerName: "Farmgate" },
    { id: "p2", name: "Brown Beans", price: 1400, image: beansImage, distance: "2.1 km", sellerName: "Local Market" },
    { id: "p3", name: "Whole Wheat Bread", price: 1200, image: breadImage, distance: "1.5 km", sellerName: "Health Bakes" },
    { id: "p4", name: "Margherita Pizza", price: 3200, image: pizzaImage, distance: "2.8 km", sellerName: "Italian Kitchen" },
  ];

  const wholesaleProducts = [
    {
      id: "w1",
      name: "50 bags Beans",
      image: beansImage,
      quantity: "50 bags (50kg each)",
      basePrice: 500000,
      tierPrices: [
        { minQuantity: 10, pricePerUnit: 11000 },
        { minQuantity: 25, pricePerUnit: 10500 },
      ],
    },
    {
      id: "w2",
      name: "10 crates Drinks",
      image: drinksImage,
      quantity: "10 crates (24 bottles each)",
      basePrice: 55000,
      tierPrices: [
        { minQuantity: 5, pricePerUnit: 5800 },
      ],
    },
  ];

  const savedItems = [
    { id: "s1", name: "Premium Rice", price: 1900, image: riceImage, distance: "3.0 km", sellerName: "Rice Hub" },
    { id: "s2", name: "Artisan Bread", price: 1000, image: breadImage, distance: "1.2 km", sellerName: "Golden Bakes" },
  ];

  const notifications = [
    { id: "n1", message: "Price drop on Premium Beans - now NGN 1,400!", time: "2 hours ago" },
    { id: "n2", message: "New seller 'Fresh Foods' joined near you", time: "5 hours ago" },
    { id: "n3", message: "Your saved item 'Ofada Rice' is back in stock", time: "1 day ago" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container px-4 py-6 md:px-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">Welcome back, {userName}!</h1>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{userLocation}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="relative" data-testid="button-notifications">
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] text-primary-foreground flex items-center justify-center">
                {notifications.length}
              </span>
            </Button>
            <Button variant="outline" size="icon" data-testid="button-saved">
              <Heart className="h-4 w-4" />
            </Button>
            {onLogout && (
              <Button variant="ghost" onClick={onLogout} data-testid="button-logout">
                Logout
              </Button>
            )}
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              data-testid="input-search"
            />
          </div>
          <Button variant="outline" data-testid="button-filter">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="nearby" data-testid="tab-nearby">
              <MapPin className="h-4 w-4 mr-2 hidden sm:inline" />
              Nearby
            </TabsTrigger>
            <TabsTrigger value="popular" data-testid="tab-popular">
              <TrendingUp className="h-4 w-4 mr-2 hidden sm:inline" />
              Popular
            </TabsTrigger>
            <TabsTrigger value="wholesale" data-testid="tab-wholesale">
              <Package className="h-4 w-4 mr-2 hidden sm:inline" />
              Wholesale
            </TabsTrigger>
            <TabsTrigger value="saved" data-testid="tab-saved">
              <Heart className="h-4 w-4 mr-2 hidden sm:inline" />
              Saved
            </TabsTrigger>
          </TabsList>

          <TabsContent value="nearby" className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {nearbyProducts.map((product) => (
                <RetailProductCard
                  key={product.id}
                  {...product}
                  onCompare={() => console.log(`Compare ${product.id}`)}
                  onBuyWithCash={() => console.log(`Buy ${product.id}`)}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="popular" className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {popularProducts.map((product) => (
                <RetailProductCard
                  key={product.id}
                  {...product}
                  onCompare={() => console.log(`Compare ${product.id}`)}
                  onBuyWithCash={() => console.log(`Buy ${product.id}`)}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="wholesale" className="space-y-6">
            <Card className="mb-4">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Package className="h-4 w-4" />
                  <span>Wholesale products are available from sellers across the country</span>
                </div>
              </CardContent>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wholesaleProducts.map((product) => (
                <WholesaleProductCard
                  key={product.id}
                  {...product}
                  onContact={() => console.log(`Contact ${product.id}`)}
                  onViewDetails={() => console.log(`View ${product.id}`)}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="saved" className="space-y-6">
            {savedItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {savedItems.map((product) => (
                  <RetailProductCard
                    key={product.id}
                    {...product}
                    onCompare={() => console.log(`Compare ${product.id}`)}
                    onBuyWithCash={() => console.log(`Buy ${product.id}`)}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No saved items yet</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
