import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, ArrowRight } from "lucide-react";

interface PriceOption {
  sellerId: string;
  sellerName: string;
  price: number;
  distance: string;
  rating: number;
  inStock: boolean;
}

interface PriceCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  productImage: string;
  priceOptions: PriceOption[];
  onSelectSeller?: (sellerId: string) => void;
}

export default function PriceCompareModal({
  isOpen,
  onClose,
  productName,
  productImage,
  priceOptions,
  onSelectSeller,
}: PriceCompareModalProps) {
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const sortedOptions = [...priceOptions].sort((a, b) => a.price - b.price);
  const lowestPrice = sortedOptions[0]?.price || 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Compare Prices</DialogTitle>
        </DialogHeader>
        
        <div className="flex items-center gap-4 mb-4 pb-4 border-b">
          <img 
            src={productImage} 
            alt={productName}
            className="w-16 h-16 object-cover rounded-md"
          />
          <div>
            <h3 className="font-semibold">{productName}</h3>
            <p className="text-sm text-muted-foreground">
              {priceOptions.length} sellers available
            </p>
          </div>
        </div>

        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {sortedOptions.map((option, index) => (
            <div
              key={option.sellerId}
              className={`p-4 rounded-md border ${
                index === 0 ? "border-success bg-success/5" : ""
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{option.sellerName}</span>
                    {index === 0 && (
                      <Badge className="bg-success text-success-foreground" variant="secondary">
                        Best Price
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {option.distance}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-primary text-primary" />
                      {option.rating}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-primary">
                    {formatPrice(option.price)}
                  </p>
                  {option.price > lowestPrice && (
                    <p className="text-xs text-muted-foreground">
                      +{formatPrice(option.price - lowestPrice)}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between mt-3">
                <Badge variant={option.inStock ? "secondary" : "destructive"}>
                  {option.inStock ? "In Stock" : "Out of Stock"}
                </Badge>
                <Button
                  size="sm"
                  disabled={!option.inStock}
                  onClick={() => onSelectSeller?.(option.sellerId)}
                  data-testid={`button-select-seller-${option.sellerId}`}
                >
                  Select
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
