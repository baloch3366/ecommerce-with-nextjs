"use client";
import { useBrowsingHistoryStore } from "@/hooks/use-browsing-history-store";
import { useEffect } from "react";

export default function AddToBrowsingHistory({
  id,
  category,
}: {
  id: string;
  category: string;
}) {
  const { addItems } = useBrowsingHistoryStore();
  useEffect(() => {
    // console.log('additems','addItems({id, category})')
    addItems({ id, category });
  }, [addItems, id, category]);
  return null;
}
