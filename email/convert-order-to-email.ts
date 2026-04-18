import { IOrder } from "@/lib/db/model/order-model";

type PopulatedUser = {
  name: string;
  email: string;
};

function isPopulatedUser(user: unknown): user is PopulatedUser {
  return (
    typeof user === "object" &&
    user !== null &&
    "email" in user &&
    "name" in user
  );
}

export function convertOrderToEmail(order: IOrder) {
  return {
    _id: order._id.toString(),
    createdAt: order.createdAt,

    isPaid: order.isPaid,
    paidAt: order.paidAt,

    totalPrice: order.totalPrice,
    itemsPrice: order.itemsPrice,
    taxPrice: order.taxPrice,
    shippingPrice: order.shippingPrice,

    user: isPopulatedUser(order.user)
      ? {
          name: order.user.name,
          email: order.user.email,
        }
      : {
          name: "",
          email: "",
        },

    shippingAddress: order.shippingAddress,
    items: order.items,
    paymentMethod: order.paymentMethod,
    expectedDeliveryDate: order.expectedDeliveryDate,
    isDelivered: order.isDelivered,
  };
}