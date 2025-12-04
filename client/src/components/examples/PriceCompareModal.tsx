import { useState } from "react";
import { Button } from "@/components/ui/button";
import PriceCompareModal from "../PriceCompareModal";
import beansImage from "@assets/generated_images/beans_product_image.png";

export default function PriceCompareModalExample() {
  const [isOpen, setIsOpen] = useState(true);

  // todo: remove mock functionality
  const mockPriceOptions = [
    { sellerId: "s1", sellerName: "Fresh Mart", price: 1400, distance: "1.2 km", rating: 4.8, inStock: true },
    { sellerId: "s2", sellerName: "Grain Store", price: 1500, distance: "2.5 km", rating: 4.5, inStock: true },
    { sellerId: "s3", sellerName: "Agro Foods", price: 1450, distance: "1.8 km", rating: 4.6, inStock: true },
    { sellerId: "s4", sellerName: "Local Market", price: 1550, distance: "3.0 km", rating: 4.2, inStock: false },
  ];

  return (
    <div className="p-4">
      <Button onClick={() => setIsOpen(true)}>Open Compare Modal</Button>
      <PriceCompareModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        productName="Premium Beans"
        productImage={beansImage}
        priceOptions={mockPriceOptions}
        onSelectSeller={(id) => console.log(`Selected seller ${id}`)}
      />
    </div>
  );
}
