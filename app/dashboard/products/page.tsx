import { db } from "@/server";
import placeholder from "@/public/placeholder_small.jpg";
import { DataTable } from "./data-table";
import { columns } from "./columns";
const Products = async () => {
  const products = await db.query.Product.findMany({
    orderBy: (product, { desc }) => [desc(product.id)],
  });
  if (!products) throw new Error("No products found");
  const dataTabel = products.map((product) => {
    return {
      id: product.id,
      title: product.title,
      price: product.price,
      variants: [],
      image: placeholder.src,
    };
  });
  if (!dataTabel) throw new Error("No data found");
  return (
    <div>
      <DataTable columns={columns} data={dataTabel} />
    </div>
  );
};
export default Products;
