import { db } from "@/server";
import placeholder from "@/public/placeholder_small.jpg";
import { DataTable } from "./data-table";
import { columns } from "./columns";
const Products = async () => {
  const products = await db.query.Product.findMany({
    with: {
      productVariants: { with: { variantsImage: true, variantsTags: true } },
    },
    orderBy: (product, { desc }) => [desc(product.id)],
  });

  if (!products) throw new Error("No products found");
  const dataTabel = products.map((product) => {
    if (product.productVariants.length === 0) {
      return {
        id: product.id,
        title: product.title,
        price: product.price,
        variants: [],
        image: placeholder.src,
      };
    }
    const image = product.productVariants[0].variantsImage[0].url;
    return {
      id: product.id,
      title: product.title,
      price: product.price,
      variants: product.productVariants,
      image,
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
