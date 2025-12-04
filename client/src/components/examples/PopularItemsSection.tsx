import PopularItemsSection from "../PopularItemsSection";

export default function PopularItemsSectionExample() {
  return (
    <PopularItemsSection
      onCompare={(id) => console.log(`Compare product ${id}`)}
      onBuyWithCash={(id) => console.log(`Buy with cash product ${id}`)}
    />
  );
}
