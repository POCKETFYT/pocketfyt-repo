import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  Package, 
  BarChart3, 
  Users, 
  Edit2, 
  Trash2,
  Eye,
  MousePointerClick,
  DollarSign,
  TrendingUp
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
import breadImage from "@assets/generated_images/bread_product_image.png";

interface SellerDashboardProps {
  userName?: string;
  onLogout?: () => void;
}

export default function SellerDashboard({ 
  userName = "Seller",
  onLogout 
}: SellerDashboardProps) {
  const [activeTab, setActiveTab] = useState("products");
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [editingPrice, setEditingPrice] = useState<string | null>(null);
  const [prices, setPrices] = useState<Record<string, number>>({
    "1": 1500,
    "2": 1800,
    "3": 800,
  });

  // todo: remove mock functionality - replace with real API data
  const products = [
    { id: "1", name: "Premium Beans", price: prices["1"], image: beansImage, stock: 50, views: 234, clicks: 45 },
    { id: "2", name: "Local Rice", price: prices["2"], image: riceImage, stock: 30, views: 189, clicks: 32 },
    { id: "3", name: "Fresh Bread", price: prices["3"], image: breadImage, stock: 100, views: 156, clicks: 28 },
  ];

  const analytics = {
    totalViews: 579,
    totalClicks: 105,
    conversionRate: 18.1,
    dailySales: 12500,
  };

  const buyerInteractions = [
    { id: "b1", buyerName: "Buyer A", product: "Premium Beans", action: "Viewed", time: "10 mins ago" },
    { id: "b2", buyerName: "Buyer B", product: "Local Rice", action: "Compared", time: "25 mins ago" },
    { id: "b3", buyerName: "Buyer C", product: "Fresh Bread", action: "Purchased", time: "1 hour ago" },
    { id: "b4", buyerName: "Buyer D", product: "Premium Beans", action: "Saved", time: "2 hours ago" },
  ];

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handlePriceUpdate = (productId: string, newPrice: number) => {
    setPrices(prev => ({ ...prev, [productId]: newPrice }));
    setEditingPrice(null);
    console.log(`Updated price for product ${productId} to ${newPrice}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container px-4 py-6 md:px-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">Seller Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {userName}</p>
          </div>
          <div className="flex items-center gap-2">
            <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
              <DialogTrigger asChild>
                <Button data-testid="button-upload-product">
                  <Plus className="h-4 w-4 mr-2" />
                  Upload Product
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Upload New Product</DialogTitle>
                </DialogHeader>
                <UploadProductForm 
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
                  <p className="text-sm text-muted-foreground">Total Views</p>
                  <p className="text-2xl font-bold">{analytics.totalViews}</p>
                </div>
                <Eye className="h-8 w-8 text-primary opacity-80" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Clicks</p>
                  <p className="text-2xl font-bold">{analytics.totalClicks}</p>
                </div>
                <MousePointerClick className="h-8 w-8 text-primary opacity-80" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Conversion</p>
                  <p className="text-2xl font-bold">{analytics.conversionRate}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-success opacity-80" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Daily Sales</p>
                  <p className="text-2xl font-bold">{formatPrice(analytics.dailySales)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-success opacity-80" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="products" data-testid="tab-products">
              <Package className="h-4 w-4 mr-2" />
              Products
            </TabsTrigger>
            <TabsTrigger value="interactions" data-testid="tab-interactions">
              <Users className="h-4 w-4 mr-2" />
              Buyer Activity
            </TabsTrigger>
            <TabsTrigger value="analytics" data-testid="tab-analytics">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-4">
            <div className="grid gap-4">
              {products.map((product) => (
                <Card key={product.id}>
                  <CardContent className="pt-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full sm:w-24 h-24 object-cover rounded-md"
                      />
                      <div className="flex-1 space-y-2">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <h3 className="font-semibold text-lg">{product.name}</h3>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">
                              {product.stock} in stock
                            </Badge>
                            <Badge variant="outline">
                              <Eye className="h-3 w-3 mr-1" />
                              {product.views}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <div className="flex items-center gap-2">
                            {editingPrice === product.id ? (
                              <Input
                                type="number"
                                defaultValue={product.price}
                                className="w-32"
                                onBlur={(e) => handlePriceUpdate(product.id, Number(e.target.value))}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    handlePriceUpdate(product.id, Number((e.target as HTMLInputElement).value));
                                  }
                                }}
                                autoFocus
                                data-testid={`input-price-${product.id}`}
                              />
                            ) : (
                              <>
                                <span className="text-xl font-bold text-primary">
                                  {formatPrice(product.price)}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setEditingPrice(product.id)}
                                  data-testid={`button-edit-price-${product.id}`}
                                >
                                  <Edit2 className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" data-testid={`button-add-stock-${product.id}`}>
                              Add Stock
                            </Button>
                            <Button variant="ghost" size="icon" data-testid={`button-delete-${product.id}`}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="interactions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Buyer Activity</CardTitle>
                <CardDescription>See how buyers interact with your products</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {buyerInteractions.map((interaction) => (
                    <div 
                      key={interaction.id}
                      className="flex items-center justify-between py-2 border-b last:border-0"
                    >
                      <div>
                        <p className="font-medium">{interaction.buyerName}</p>
                        <p className="text-sm text-muted-foreground">
                          {interaction.action} "{interaction.product}"
                        </p>
                      </div>
                      <span className="text-sm text-muted-foreground">{interaction.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Performance Overview</CardTitle>
                <CardDescription>Your store's performance this week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-muted/50 rounded-md">
                  <div className="text-center text-muted-foreground">
                    <BarChart3 className="h-12 w-12 mx-auto mb-2" />
                    <p>Analytics charts will appear here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
