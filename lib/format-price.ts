export const formatPrice = (price: number) => {
  return new Intl.NumberFormat("vi", {
    currency: "VND",
    style: "currency",
  }).format(price);
};
