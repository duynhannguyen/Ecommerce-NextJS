import { create } from "zustand";
import { persist } from "zustand/middleware";
export type Variant = {
  variantId: number;
  quantity: number;
};

export type CartItem = {
  name: string;
  image: string;
  id: number;
  variant: Variant;
  price: number;
};

export type CartState = {
  cart: CartItem[];
  checkoutProgress: "cart-page" | "payment-page" | "confirmation-page";
  setCheckoutProgress: (
    value: "cart-page" | "payment-page" | "confirmation-page"
  ) => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (item: CartItem) => void;
  clearCart: () => void;
  cartOpen: boolean;
  setCartOpen: (value: boolean) => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cart: [],
      discountCode: [],
      checkoutProgress: "cart-page",
      cartOpen: false,
      setCartOpen: (value) => set({ cartOpen: value }),
      setCheckoutProgress: (value) =>
        set((state) => ({ checkoutProgress: value })),
      clearCart: () => set({ cart: [] }),
      addToCart: (item) =>
        set((state) => {
          const existingItem = state.cart.find(
            (cartItem) => cartItem.variant.variantId === item.variant.variantId
          );
          if (existingItem) {
            const updatedCart = state.cart.map((cartItem) => {
              if (cartItem.variant.variantId === item.variant.variantId) {
                return {
                  ...cartItem,
                  variant: {
                    ...cartItem.variant,
                    quantity: cartItem.variant.quantity + item.variant.quantity,
                  },
                };
              }
              return cartItem;
            });
            return { cart: updatedCart };
          } else {
            return {
              cart: [
                ...state.cart,
                {
                  ...item,
                  quantity: item.variant.quantity,
                  variantId: item.variant.variantId,
                },
              ],
            };
          }
        }),
      removeFromCart: (item) =>
        set((state) => {
          const updatedCart = state.cart.map((cartItem) => {
            if (cartItem.variant.variantId === item.variant.variantId) {
              return {
                ...cartItem,
                variant: {
                  ...cartItem.variant,
                  quantity: cartItem.variant.quantity - 1,
                },
              };
            }
            return cartItem;
          });
          return {
            cart: updatedCart.filter((item) => item.variant.quantity > 0),
          };
        }),
    }),
    { name: "cart-storage" }
  )
);
