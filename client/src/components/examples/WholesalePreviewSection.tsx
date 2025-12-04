import WholesalePreviewSection from "../WholesalePreviewSection";

export default function WholesalePreviewSectionExample() {
  return (
    <WholesalePreviewSection
      onContact={(id) => console.log(`Contact wholesale seller ${id}`)}
      onViewDetails={(id) => console.log(`View wholesale details ${id}`)}
    />
  );
}
