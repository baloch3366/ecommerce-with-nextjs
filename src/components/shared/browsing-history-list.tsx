"use client";

import { useBrowsingHistoryStore } from "@/hooks/use-browsing-history-store";
import { cn } from "@/lib/utils";
import { Separator } from "@radix-ui/react-select";
import { useEffect, useState } from "react";
import ProductSlider from "./product/product-slider";

export default function BrowsingHistoryList({
  className,
}: {
  className?: string;
}) {
  const { products } = useBrowsingHistoryStore();
  return (
    products.length !== 0 && (
      <div className={cn("bg-background", className)}>
        <Separator className="mb-4" />
        <ProductList
          title={"Related to items you have viewed"}
          type="related"
        />
        <Separator className="mb-4" />
        <ProductList
          title={"Your Browser History"}
          type="history"
          hideDetails
        />
      </div>
    )
  );
}
function ProductList({
  title,
  type = "history",
  hideDetails = false,
}: {
  title: string;
  type: "history" | "related";
  hideDetails?: boolean;
}) {
  const { products } = useBrowsingHistoryStore();
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch(
        `/api/products/browsing-history?type=${type}&categories=${products
          .map((product) => product.category)
          .join(',')}&ids=${products.map((product) => product.id).join(',')}`
      )
      const data = await res.json();
      setData(data);
    };
    fetchProducts();
  }, [products, type]);
  return (
    products.length > 0 && (
      <ProductSlider title={title} products={data} hideDetails={hideDetails} />
    )
  );
}


