import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Scale } from "lucide-react";

interface RetailProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  distance?: string;
  sellerName?: string;
  shippingCost?: number;
  onCompare?: () => void;
  onBuyWithCash?: () => void;
}

export default function RetailProductCard({
  id,
  name,
  price,
  image,
  distance,
  sellerName,
  shippingCost,
  onCompare,
  onBuyWithCash,
}: RetailProductCardProps) {
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card 
      className="overflow-hidden hover-elevate"
      data-testid={`card-product-${id}`}
    >
      <div className="aspect-square overflow-hidden bg-muted">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          data-testid={`img-product-${id}`}
        />
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-1 truncate" data-testid={`text-product-name-${id}`}>
          {name}
        </h3>
        {sellerName && (
          <p className="text-sm text-muted-foreground mb-2 truncate">
            by {sellerName}
          </p>
        )}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-2xl font-bold text-primary" data-testid={`text-product-price-${id}`}>
            {formatPrice(price)}
          </span>
          {distance && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {distance}
            </Badge>
          )}
        </div>
        {shippingCost && shippingCost > 0 && (
          <p className="text-xs text-muted-foreground mb-3">
            + {formatPrice(shippingCost)} shipping
          </p>
        )}
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={onCompare}
            data-testid={`button-compare-${id}`}
          >
            <Scale className="h-4 w-4 mr-1" />
            Compare
          </Button>
          <Button 
            size="sm" 
            className="flex-1 bg-success text-success-foreground"
            onClick={onBuyWithCash}
            data-testid={`button-buy-cash-${id}`}
          >
            Buy with Cash
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
