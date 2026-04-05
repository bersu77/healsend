import CartClient from "./cart-client";
import { getCartForRequest } from "@/lib/cart";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Your Cart | HealSend",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function CartPage() {
  const { cart } = await getCartForRequest({ createIfMissing: true });

  return <CartClient initialCart={JSON.parse(JSON.stringify(cart))} />;
}
