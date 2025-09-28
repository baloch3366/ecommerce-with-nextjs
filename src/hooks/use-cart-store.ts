import { create } from "zustand";
import { persist } from "zustand/middleware";

import { Cart, OrderItem, ShippingAddress } from "@/types";
import { calculateDeliveryDateAndPrice } from "@/lib/actions/order-action";

// --- Initial state ---
const initialState: Cart = {
  items: [],
  itemsPrice: 0,
  taxPrice: undefined,
  shippingPrice: undefined,
  totalPrice: 0,
  paymentMethod: undefined,
  deliveryDateIndex: undefined,
  shippingAddress: undefined,
};

// --- Helper function ---
const isSameItem = (a: OrderItem, b: OrderItem) =>
  a.product === b.product && a.color === b.color && a.size === b.size;

interface CartState {
  cart: Cart;
  addItem: (item: OrderItem, quantity: number) => Promise<string>;
  updateItem: (item: OrderItem, quantity: number) => Promise<void>;
  removeItem: (item: OrderItem) => Promise<void>;
  clearCart: () => void;
  init: () => void;

  // checkout-related actions
  setShippingAddress: (shippingAddress: ShippingAddress) => Promise<void>;
  setPaymentMethod: (paymentMethod: string) => void;
  setDeliveryDateIndex: (index: number) => Promise<void>;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: initialState,

      // --- Add item ---
      addItem: async (item, quantity) => {
        const { cart } = get();
        const { items, shippingAddress } = cart;

        // Check if item already exists
        const existingItem = items.find((x) => isSameItem(x, item));
        const totalQuantity = quantity + (existingItem?.quantity ?? 0);

        if (item.countInStock < totalQuantity) {
          throw new Error("Not enough items in stock");
        }

        // Update or add new item
        const updatedItems = existingItem
          ? items.map((x) =>
              isSameItem(x, item)
                ? { ...x, quantity: x.quantity + quantity }
                : x
            )
          : [...items, { ...item, quantity }];

        // Recalculate totals + delivery
        const deliveryInfo = await calculateDeliveryDateAndPrice({
          items: updatedItems,
          shippingAddress,
        });

        set({
          cart: {
            ...cart,
            items: updatedItems,
            ...deliveryInfo,
          },
        });

        // Return clientId of the added item
        const addedItem = updatedItems.find((x) => isSameItem(x, item));
        if (!addedItem) throw new Error("Item not added to cart");
        return addedItem.clientId;
      },

      // --- Update item quantity ---
      updateItem: async (item, quantity) => {
        const { cart } = get();
        const { items, shippingAddress } = cart;

        const exist = items.find((x) => isSameItem(x, item));
        if (!exist) return;
         //rplace quantity
        const updatedItems = items.map((x) =>
          isSameItem(x, item) ? { ...exist, quantity } : x
        );

        set({
          cart: {
            ...cart,
            items: updatedItems,
            ...(await calculateDeliveryDateAndPrice({
              items: updatedItems,
              shippingAddress,
            })),
          },
        });
      },

      // --- Remove item ---
      removeItem: async (item) => {
        const { cart } = get();
        const { items, shippingAddress } = cart;

        const updatedItems = items.filter((x) => !isSameItem(x, item));

        set({
          cart: {
            ...cart,
            items: updatedItems,
            ...(await calculateDeliveryDateAndPrice({
              items: updatedItems,
              shippingAddress,
            })),
          },
        });
      },

      // --- Clear items ---
      clearCart: () => {
        set({
          cart: {
            ...get().cart,
            items: [],
          },
        });
      },

      // --- Reset entire cart ---
      init: () => set({ cart: initialState }),

      // --- Checkout-related actions ---
      setShippingAddress: async (shippingAddress) => {
        const { items } = get().cart;
        set({
          cart: {
            ...get().cart,
            shippingAddress,
            ...(await calculateDeliveryDateAndPrice({
              items,
              shippingAddress,
            })),
          },
        });
      },

      setPaymentMethod: (paymentMethod) => {
        set({
          cart: {
            ...get().cart,
            paymentMethod,
          },
        });
      },

      setDeliveryDateIndex: async (index) => {
        const { items, shippingAddress } = get().cart;

        set({
          cart: {
            ...get().cart,
            ...(await calculateDeliveryDateAndPrice({
              items,
              shippingAddress,
              deliveryDateIndex: index,
            })),
          },
        });
      },
    }),
    {
      name: "cart-store", // persisted key in localStorage
      partialize: (state) => ({ cart: state.cart }), // only persist the cart slice
    }
  )
);
