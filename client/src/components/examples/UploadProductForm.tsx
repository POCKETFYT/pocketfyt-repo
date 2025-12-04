import UploadProductForm from "../UploadProductForm";

export default function UploadProductFormExample() {
  return (
    <div className="p-4">
      <UploadProductForm
        isWholesaler={true}
        onSubmit={(data) => console.log("Product submitted:", data)}
        onCancel={() => console.log("Cancelled")}
      />
    </div>
  );
}
