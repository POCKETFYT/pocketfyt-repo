import WholesaleProductCard from "../WholesaleProductCard";
import beansImage from "@assets/generated_images/beans_product_image.png";

export default function WholesaleProductCardExample() {
  return (
    <div className="max-w-sm">
      <WholesaleProductCard
        id="1"
        name="50 bags Beans"
        image={beansImage}
        quantity="50 bags (50kg each)"
        basePrice={500000}
        tierPrices={[
          { minQuantity: 10, pricePerUnit: 11000 },
          { minQuantity: 25, pricePerUnit: 10500 },
          { minQuantity: 50, pricePerUnit: 10000 },
        ]}
        hasDelivery={true}
        onContact={() => console.log("Contact clicked")}
        onViewDetails={() => console.log("View details clicked")}
      />
    </div>
  );
}
