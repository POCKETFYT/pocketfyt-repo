import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Truck, Package } from "lucide-react";

interface TierPrice {
  minQuantity: number;
  pricePerUnit: number;
}

interface WholesaleProductCardProps {
  id: string;
  name: string;
  image: string;
  quantity: string;
  basePrice: number;
  tierPrices?: TierPrice[];
  hasDelivery?: boolean;
  onContact?: () => void;
  onViewDetails?: () => void;
}

export default function WholesaleProductCard({
  id,
  name,
  image,
  quantity,
  basePrice,
  tierPrices = [],
  hasDelivery = true,
  onContact,
  onViewDetails,
}: WholesaleProductCardProps) {
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
      data-testid={`card-wholesale-${id}`}
    >
      <div className="aspect-video overflow-hidden bg-muted relative">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover"
          data-testid={`img-wholesale-${id}`}
        />
        <Badge className="absolute top-2 right-2 bg-primary">
          <Package className="h-3 w-3 mr-1" />
          Wholesale
        </Badge>
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg" data-testid={`text-wholesale-name-${id}`}>
          {name}
        </CardTitle>
        <p className="text-sm text-muted-foreground">{quantity}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-2xl font-bold text-primary" data-testid={`text-wholesale-price-${id}`}>
          {formatPrice(basePrice)}
        </div>
        
        {tierPrices.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Tier Pricing:</p>
            <div className="space-y-1">
              {tierPrices.map((tier, index) => (
                <div 
                  key={index} 
                  className="flex justify-between text-sm bg-muted/50 px-2 py-1 rounded"
                >
                  <span>{tier.minQuantity}+ units</span>
                  <span className="font-medium text-success">
                    {formatPrice(tier.pricePerUnit)}/unit
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {hasDelivery && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Truck className="h-4 w-4" />
            <span>Delivery available nationwide</span>
          </div>
        )}
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={onViewDetails}
            data-testid={`button-view-wholesale-${id}`}
          >
            View Details
          </Button>
          <Button 
            className="flex-1"
            onClick={onContact}
            data-testid={`button-contact-wholesale-${id}`}
          >
            Contact Seller
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
