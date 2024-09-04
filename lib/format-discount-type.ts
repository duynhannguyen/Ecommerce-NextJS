import { formatPrice } from "./format-price";

export const formatDiscount = (
  discountType: "Percented" | "Fixed",
  discountAmount: number
) => {
  switch (discountType) {
    case "Percented":
      return new Intl.NumberFormat("vi", {
        style: "percent",
      }).format(discountAmount / 100);
    case "Fixed":
      return formatPrice(discountAmount);
    default:
      throw new Error(
        `Invaild discount code type ${discountType satisfies never} `
      );
  }
};
