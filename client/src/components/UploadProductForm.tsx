import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, MapPin, X, Plus, Trash2 } from "lucide-react";

interface TierPrice {
  minQuantity: string;
  pricePerUnit: string;
}

interface UploadProductFormProps {
  isWholesaler?: boolean;
  onSubmit?: (data: any) => void;
  onCancel?: () => void;
}

export default function UploadProductForm({ 
  isWholesaler = false, 
  onSubmit,
  onCancel 
}: UploadProductFormProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [retailPrice, setRetailPrice] = useState("");
  const [wholesalePrice, setWholesalePrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [description, setDescription] = useState("");
  const [tierPrices, setTierPrices] = useState<TierPrice[]>([
    { minQuantity: "", pricePerUnit: "" }
  ]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
  };

  const addTierPrice = () => {
    setTierPrices([...tierPrices, { minQuantity: "", pricePerUnit: "" }]);
  };

  const removeTierPrice = (index: number) => {
    setTierPrices(tierPrices.filter((_, i) => i !== index));
  };

  const updateTierPrice = (index: number, field: keyof TierPrice, value: string) => {
    const updated = [...tierPrices];
    updated[index][field] = value;
    setTierPrices(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      productName,
      category,
      retailPrice,
      wholesalePrice,
      quantity,
      description,
      tierPrices: isWholesaler ? tierPrices : undefined,
      image: imagePreview,
    };
    onSubmit?.(data);
    console.log("Form submitted:", data);
  };

  const categories = [
    "Grains & Cereals",
    "Beverages",
    "Bakery",
    "Dairy",
    "Fruits & Vegetables",
    "Meat & Poultry",
    "Snacks",
    "Household",
    "Other",
  ];

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Upload Product</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label>Product Image</Label>
            <div className="border-2 border-dashed rounded-md p-4">
              {imagePreview ? (
                <div className="relative inline-block">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-h-48 rounded-md"
                    data-testid="img-product-preview"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 h-6 w-6"
                    onClick={removeImage}
                    data-testid="button-remove-image"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center h-32 cursor-pointer">
                  <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                  <span className="text-sm text-muted-foreground">
                    Click to upload image
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                    data-testid="input-product-image"
                  />
                </label>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="productName">Product Name</Label>
            <Input
              id="productName"
              placeholder="Enter product name"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              data-testid="input-product-name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger data-testid="select-category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              placeholder="Describe your product..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              data-testid="input-description"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="retailPrice">Retail Price (NGN)</Label>
              <Input
                id="retailPrice"
                type="number"
                placeholder="0"
                value={retailPrice}
                onChange={(e) => setRetailPrice(e.target.value)}
                data-testid="input-retail-price"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="wholesalePrice">Wholesale Price (NGN) - Optional</Label>
              <Input
                id="wholesalePrice"
                type="number"
                placeholder="0"
                value={wholesalePrice}
                onChange={(e) => setWholesalePrice(e.target.value)}
                data-testid="input-wholesale-price"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Stock Quantity</Label>
            <Input
              id="quantity"
              type="number"
              placeholder="0"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              data-testid="input-quantity"
            />
          </div>

          {isWholesaler && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Tier Pricing</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addTierPrice}
                  data-testid="button-add-tier"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Tier
                </Button>
              </div>
              <div className="space-y-3">
                {tierPrices.map((tier, index) => (
                  <div key={index} className="flex items-end gap-3">
                    <div className="flex-1 space-y-1">
                      <Label className="text-xs">Min Quantity</Label>
                      <Input
                        type="number"
                        placeholder="10"
                        value={tier.minQuantity}
                        onChange={(e) => updateTierPrice(index, "minQuantity", e.target.value)}
                        data-testid={`input-tier-quantity-${index}`}
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <Label className="text-xs">Price per Unit (NGN)</Label>
                      <Input
                        type="number"
                        placeholder="1000"
                        value={tier.pricePerUnit}
                        onChange={(e) => updateTierPrice(index, "pricePerUnit", e.target.value)}
                        data-testid={`input-tier-price-${index}`}
                      />
                    </div>
                    {tierPrices.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeTierPrice(index)}
                        data-testid={`button-remove-tier-${index}`}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
            <MapPin className="h-4 w-4" />
            <span>Location will be auto-detected from your profile</span>
          </div>

          <div className="flex gap-3">
            {onCancel && (
              <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button type="submit" className="flex-1" data-testid="button-publish-product">
              Publish Now
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
