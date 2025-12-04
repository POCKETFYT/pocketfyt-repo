import RetailProductCard from "./RetailProductCard";
import beansImage from "@assets/generated_images/beans_product_image.png";
import riceImage from "@assets/generated_images/rice_product_image.png";
import breadImage from "@assets/generated_images/bread_product_image.png";
import pizzaImage from "@assets/generated_images/pizza_product_image.png";

interface PopularItemsSectionProps {
  onCompare?: (productId: string) => void;
  onBuyWithCash?: (productId: string) => void;
}

export default function PopularItemsSection({ onCompare, onBuyWithCash }: PopularItemsSectionProps) {
  // todo: remove mock functionality - replace with real API data
  const popularItems = [
    { id: "1", name: "Premium Beans", price: 1500, image: beansImage, distance: "1.2 km", sellerName: "Fresh Mart" },
    { id: "2", name: "Local Rice", price: 1500, image: riceImage, distance: "2.5 km", sellerName: "Grain Store" },
    { id: "3", name: "Fresh Bread", price: 1500, image: breadImage, distance: "0.8 km", sellerName: "Bakery Plus" },
    { id: "4", name: "Pepperoni Pizza", price: 1500, image: pizzaImage, distance: "3.1 km", sellerName: "Pizza House" },
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-2">Popular Items</h2>
          <p className="text-muted-foreground">Best deals near you</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularItems.map((item) => (
            <RetailProductCard
              key={item.id}
              {...item}
              onCompare={() => onCompare?.(item.id)}
              onBuyWithCash={() => onBuyWithCash?.(item.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
