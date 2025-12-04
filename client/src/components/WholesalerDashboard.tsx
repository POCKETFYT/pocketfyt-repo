import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  Package, 
  Users, 
  Truck,
  Upload,
  BarChart3,
  Edit2,
  Trash2,
  FileSpreadsheet
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import UploadProductForm from "./UploadProductForm";
import beansImage from "@assets/generated_images/beans_product_image.png";
import riceImage from "@assets/generated_images/rice_product_image.png";
import drinksImage from "@assets/generated_images/drinks_crate_product_image.png";

interface WholesalerDashboardProps {
  userName?: string;
  onLogout?: () => void;
}

export default function WholesalerDashboard({ 
  userName = "Wholesaler",
  onLogout 
}: WholesalerDashboardProps) {
  const [activeTab, setActiveTab] = useState("inventory");
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // todo: remove mock functionality - replace with real API data
  const inventory = [
    { 
      id: "1", 
      name: "50 bags Beans", 
      image: beansImage, 
      stock: 150, 
      basePrice: 500000,
      tierPrices: [
        { minQty: 10, price: 11000 },
        { minQty: 25, price: 10500 },
        { minQty: 50, price: 10000 },
      ]
    },
    { 
      id: "2", 
      name: "20 bags Rice", 
      image: riceImage, 
      stock: 80, 
      basePrice: 180000,
      tierPrices: [
        { minQty: 5, price: 9500 },
        { minQty: 10, price: 9000 },
        { minQty: 20, price: 8500 },
      ]
    },
    { 
      id: "3", 
      name: "10 crates Drinks", 
      image: drinksImage, 
      stock: 200, 
      basePrice: 55000,
      tierPrices: [
        { minQty: 5, price: 5800 },
        { minQty: 10, price: 5500 },
      ]
    },
  ];

  const bulkBuyers = [
    { id: "bb1", name: "Lagos Supermarket Chain", orders: 12, totalValue: 6500000, status: "Active" },
    { id: "bb2", name: "Ibadan Wholesale Market", orders: 8, totalValue: 4200000, status: "Active" },
    { id: "bb3", name: "Abuja Retail Group", orders: 5, totalValue: 2800000, status: "New" },
    { id: "bb4", name: "Port Harcourt Distributors", orders: 15, totalValue: 8100000, status: "Active" },
  ];

  const logisticsPartners = [
    { id: "l1", name: "GIG Logistics", coverage: "Nationwide", rating: 4.8 },
    { id: "l2", name: "DHL Express", coverage: "International", rating: 4.9 },
    { id: "l3", name: "Kwik Delivery", coverage: "Lagos, Ogun, Oyo", rating: 4.5 },
  ];

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container px-4 py-6 md:px-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">Wholesaler Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {userName}</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button variant="outline" data-testid="button-bulk-upload">
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Bulk Upload
            </Button>
            <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
              <DialogTrigger asChild>
                <Button data-testid="button-upload-product">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add Wholesale Product</DialogTitle>
                </DialogHeader>
                <UploadProductForm 
                  isWholesaler={true}
                  onSubmit={(data) => {
                    console.log("Product uploaded:", data);
                    setIsUploadOpen(false);
                  }}
                  onCancel={() => setIsUploadOpen(false)}
                />
              </DialogContent>
            </Dialog>
            {onLogout && (
              <Button variant="ghost" onClick={onLogout} data-testid="button-logout">
                Logout
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Products</p>
                  <p className="text-2xl font-bold">{inventory.length}</p>
                </div>
                <Package className="h-8 w-8 text-primary opacity-80" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Bulk Buyers</p>
                  <p className="text-2xl font-bold">{bulkBuyers.length}</p>
                </div>
                <Users className="h-8 w-8 text-primary opacity-80" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Stock</p>
                  <p className="text-2xl font-bold">
                    {inventory.reduce((sum, item) => sum + item.stock, 0)}
                  </p>
                </div>
                <Package className="h-8 w-8 text-success opacity-80" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Logistics Partners</p>
                  <p className="text-2xl font-bold">{logisticsPartners.length}</p>
                </div>
                <Truck className="h-8 w-8 text-primary opacity-80" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="inventory" data-testid="tab-inventory">
              <Package className="h-4 w-4 mr-2" />
              Inventory
            </TabsTrigger>
            <TabsTrigger value="buyers" data-testid="tab-buyers">
              <Users className="h-4 w-4 mr-2" />
              Bulk Buyers
            </TabsTrigger>
            <TabsTrigger value="logistics" data-testid="tab-logistics">
              <Truck className="h-4 w-4 mr-2" />
              Logistics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="inventory" className="space-y-4">
            {inventory.map((item) => (
              <Card key={item.id}>
                <CardContent className="pt-4">
                  <div className="flex flex-col lg:flex-row gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full lg:w-32 h-32 object-cover rounded-md"
                    />
                    <div className="flex-1 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <h3 className="font-semibold text-lg">{item.name}</h3>
                        <Badge variant="secondary" className="w-fit">
                          {item.stock} units in stock
                        </Badge>
                      </div>
                      <div className="text-xl font-bold text-primary">
                        {formatPrice(item.basePrice)}
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Tier Pricing:</p>
                        <div className="flex flex-wrap gap-2">
                          {item.tierPrices.map((tier, index) => (
                            <Badge key={index} variant="outline">
                              {tier.minQty}+ @ {formatPrice(tier.price)}/unit
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" data-testid={`button-edit-${item.id}`}>
                          <Edit2 className="h-4 w-4 mr-1" />
                          Edit Tiers
                        </Button>
                        <Button variant="outline" size="sm" data-testid={`button-add-stock-${item.id}`}>
                          Add Stock
                        </Button>
                        <Button variant="ghost" size="icon" data-testid={`button-delete-${item.id}`}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="buyers" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Bulk Buyer Connections</CardTitle>
                <CardDescription>Your regular wholesale customers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bulkBuyers.map((buyer) => (
                    <div 
                      key={buyer.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b last:border-0 gap-2"
                    >
                      <div>
                        <p className="font-medium">{buyer.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {buyer.orders} orders • {formatPrice(buyer.totalValue)} total
                        </p>
                      </div>
                      <Badge 
                        variant={buyer.status === "Active" ? "default" : "secondary"}
                        className={buyer.status === "Active" ? "bg-success" : ""}
                      >
                        {buyer.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logistics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Logistics Partners</CardTitle>
                <CardDescription>Delivery partners for your wholesale orders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {logisticsPartners.map((partner) => (
                    <div 
                      key={partner.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-b last:border-0 gap-2"
                    >
                      <div>
                        <p className="font-medium">{partner.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Coverage: {partner.coverage}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          Rating: {partner.rating}/5
                        </Badge>
                        <Button size="sm" variant="outline">
                          Contact
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
