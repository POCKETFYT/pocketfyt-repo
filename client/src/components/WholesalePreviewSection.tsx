import WholesaleProductCard from "./WholesaleProductCard";
import beansImage from "@assets/generated_images/beans_product_image.png";
import riceImage from "@assets/generated_images/rice_product_image.png";
import drinksImage from "@assets/generated_images/drinks_crate_product_image.png";

interface WholesalePreviewSectionProps {
  onContact?: (productId: string) => void;
  onViewDetails?: (productId: string) => void;
}

export default function WholesalePreviewSection({ onContact, onViewDetails }: WholesalePreviewSectionProps) {
  // todo: remove mock functionality - replace with real API data
  const wholesaleItems = [
    {
      id: "w1",
      name: "50 bags Beans",
      image: beansImage,
      quantity: "50 bags (50kg each)",
      basePrice: 500000,
      tierPrices: [
        { minQuantity: 10, pricePerUnit: 11000 },
        { minQuantity: 25, pricePerUnit: 10500 },
        { minQuantity: 50, pricePerUnit: 10000 },
      ],
    },
    {
      id: "w2",
      name: "20 bags Rice",
      image: riceImage,
      quantity: "20 bags (25kg each)",
      basePrice: 180000,
      tierPrices: [
        { minQuantity: 5, pricePerUnit: 9500 },
        { minQuantity: 10, pricePerUnit: 9000 },
        { minQuantity: 20, pricePerUnit: 8500 },
      ],
    },
    {
      id: "w3",
      name: "10 crates Drinks",
      image: drinksImage,
      quantity: "10 crates (24 bottles each)",
      basePrice: 55000,
      tierPrices: [
        { minQuantity: 5, pricePerUnit: 5800 },
        { minQuantity: 10, pricePerUnit: 5500 },
      ],
    },
  ];

  return (
    <section className="py-16 bg-card">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-2">Wholesale Deals</h2>
          <p className="text-muted-foreground">Buy in bulk and save more</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wholesaleItems.map((item) => (
            <WholesaleProductCard
              key={item.id}
              {...item}
              onContact={() => onContact?.(item.id)}
              onViewDetails={() => onViewDetails?.(item.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
