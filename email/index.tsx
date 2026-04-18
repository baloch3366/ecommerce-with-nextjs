// import { SENDER_EMAIL, SENDER_NAME } from "@/lib/constant";
// import { Resend } from 'resend';
// import { IOrder } from "@/lib/db/model/order-model";
// import PurchaseReceiptEmail from "./purchase-receipt";

// const resend = new Resend(process.env.RESEND_API_KEY  as string)

// export const sendPurchaseReceipt = async({order}:{order:IOrder}) => {
//     await resend.emails.send({
//         from: `${SENDER_NAME} <${SENDER_EMAIL}>`,
//         to: (order.user as {email: string}).email,
//         subject: `Order Confirmation`,
//         react: <PurchaseReceiptEmail order={order} />
//     })
// }

import { Resend } from "resend";
import { SENDER_EMAIL, SENDER_NAME } from "@/lib/constant";

import PurchaseReceiptEmail from "./purchase-receipt";
import { IOrder } from "@/lib/db/model/order-model";
import { convertOrderToEmail } from "./convert-order-to-email";
// import { convertOrderToEmail } from "@";

const resend = new Resend(process.env.RESEND_API_KEY as string);

/* -----------------------------
   SEND PURCHASE RECEIPT EMAIL
------------------------------*/

export const sendPurchaseReceipt = async ({
  order,
}: {
  order: IOrder;
}) => {
  // convert DB order → email safe object
  const emailOrder = convertOrderToEmail(order);

  await resend.emails.send({
    from: `${SENDER_NAME} <${SENDER_EMAIL}>`,
    to: emailOrder.user.email,
    subject: "Order Confirmation",
    react: <PurchaseReceiptEmail order={emailOrder} />,
  });
};