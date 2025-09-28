"use client";
import useCartSidebar from "@/hooks/use-cart-sidebar";
import { useCartStore } from "@/hooks/use-cart-store";
import useIsMounted from "@/hooks/use-is-mounted";
import { cn } from "@/lib/utils";
import { ShoppingCartIcon } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function CartButton() {
  const isMounted = useIsMounted();
  const {
    cart: { items },
  } = useCartStore();
  const isCartSidebarOpen = useCartSidebar();
  const cartItemsCount = items.reduce((acc, c) => acc + c.quantity, 0);
  useEffect(() => {

  // console.log('isCartSidebarOpen:', isCartSidebarOpen)
}, [isCartSidebarOpen])

  return (
    <Link href="/cart" className="px-1 header-button">
      <div className="flex items-end text-xs relative">
        <ShoppingCartIcon className="h-8 w-8" />

        {isMounted && (
          <span
            className={cn(
              "bg-black rounded-full text-primary font-bold absolute right-[30px] top-[-4px] z-10",
              cartItemsCount >= 10
                ? "text-sm px-0 p-[1px]" // Two-digit cart (like 10, 15, 99)
                : "text-base px-1" // One-digit cart (like 1–9)
            )}
          >
            {cartItemsCount}
          </span>
        )}
        <span className="font-bold">Cart</span>
        {isCartSidebarOpen && (
          <div
            className={`absolute top-[20px] right-[-16px] rotate-[-90deg] z-10 w-0 h-0 border-l-[7px] border-r-[7px] border-b-[8px] border-transparent border-b-background`}
          ></div>
        )}
      </div>
    </Link>
  );
}
