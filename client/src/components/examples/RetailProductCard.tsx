import RetailProductCard from "../RetailProductCard";
import beansImage from "@assets/generated_images/beans_product_image.png";

export default function RetailProductCardExample() {
  return (
    <div className="max-w-xs">
      <RetailProductCard
        id="1"
        name="Premium Beans"
        price={1500}
        image={beansImage}
        distance="2.5 km"
        sellerName="Fresh Mart"
        onCompare={() => console.log("Compare clicked")}
        onBuyWithCash={() => console.log("Buy with cash clicked")}
      />
    </div>
  );
}
