import { IProduct } from "@/lib/db/model/product.model";
import Link from "next/link";
import { Button } from "../../ui/button";

export default function SelectVariant({
  product,
  color,
  size,
}: {
  product: IProduct;
  color: string;
  size: string;
}) {
  const selectedColor = color || product.colors[0];
  const selectSize = size || product.sizes[0];
  return (
    <>
      {product.colors.length > 0 && (
        <div className="space-x-2 space-y-2">
          <div>Color:</div>
          {product.colors.map((x: string) => (
            <Button
              asChild
              variant="outline"
              key={x}
              className={
                selectedColor === x ? "border-2 bg-primary" : "border-2"
              }
            >
              <Link
                replace // Change the URL, but don’t leave a trace in the browser history.
                scroll={false}
                href={`?${new URLSearchParams({ color: x, size: selectSize })}`}
                key={x}
              >
                <div
                  style={{ backgroundColor: x }}
                  className="w-4 h-4 rounded-full border border-muted-foreground"
                ></div>
                {x}
              </Link>
            </Button>
          ))}
        </div>
      )}

      {product.sizes.length > 0 && (
        <div className="mt-2 space-x-2 space-y-2">
          <div>Size:</div>
          {product.sizes.map((x: string) => (
            <Button
              asChild
              key={x}
              variant="outline"
              className={
                selectSize === x ? "border-2 border-primary" : "border-2 "
              }
            >
              <Link
                replace
                scroll={false}
                href={`?${new URLSearchParams({
                  color: selectedColor,
                  size: x,
                })}`}
              >
                {x}
              </Link>
            </Button>
          ))}
        </div>
      )}
    </>
  );
}
