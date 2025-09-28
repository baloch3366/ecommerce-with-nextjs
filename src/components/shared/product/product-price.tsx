// "use client"
// import { cn, currency_formate } from "@/lib/utils";

// const ProductPrice = (
//    { price,
//     className,
//     listPrice = 0,
//     isDeal=false,
//     forListing =true,
//     plain = false
// }:{
//     price:number,
//     className?:string,
//     listPrice?:number,
//     isDeal?:boolean,
//     forListing?:boolean,
//     plain?: boolean,
// }) => {
//    //Guard against undefined or invalid price
//   if (typeof price !== 'number' || isNaN(price)) return null;

//   const discountPercent = listPrice > 0 
//   ? Math.round(100 - (price / listPrice) * 100) : 0

//       const stringValue = price.toString();
//       const [intValue, floatValue ] = stringValue.includes(".") ?
//       stringValue.split('.') : [stringValue, ""]

//     return plain ? (
//         currency_formate(price)
//     ) : listPrice == 0 ? (
//         <div className={cn('text-3xl', className)}>
//           <span className="text-xs align-super">Rs.</span>
//           {intValue}
//           <span className="text-xs align-super">{floatValue}</span>
//         </div>
//     ): isDeal ? (
//         <div className="space-y-2">
//             <div className="flex justify-center items-center gap-2" >
//                 <span className="bg-red-700 p-1 rounded-sm text-white font-semibold text-sm">
//                     {discountPercent}% off 
//                 </span>
//                 <span className="text-red-700 font-bold text-sm">
//                     Limited Time To Deal
//                 </span>
//             </div>

//             <div
//             className={`flex ${forListing && 'justify-center'}
//             items-center gap-2`}
//             >
//              <div className={cn("text-3xl", className)}>
//                 <span className="text-sm align-super">Rs.</span>
//                  {intValue}
//                 <span className="text-sm align-super"> {floatValue}</span>
//              </div >
//              <div className="text-muted-foreground text-xs py-2">
//                Was: {' '}
//                <span className="line-through">{currency_formate(listPrice)}</span>
//                </div>
//             </div>

//         </div>
//     ): (
//         <div
//         >
//       <div className='flex justify-center gap-3'>
//         <div className='text-3xl text-orange-700'>-{discountPercent}%</div>
//         <div className={cn('text-3xl', className)}>
//           <span className='text-xs align-super'>₹</span>
//           {intValue}
//           <span className='text-xs align-super'>{floatValue}</span>
//         </div>
//       </div>
//       <div className='text-muted-foreground text-xs py-2'>
//         List price:{' '}
//         <span className='line-through'>{currency_formate(listPrice)}</span>
//       </div>
//     </div>
//     )
// }

// export default ProductPrice;



"use client";
import { cn, currency_formate } from "@/lib/utils";

const ProductPrice = ({
  price,
  className,
  listPrice = 0,
  isDeal = false,
  forListing = true,
  plain = false,
}: {
  price: number;
  className?: string;
  listPrice?: number;
  isDeal?: boolean;
  forListing?: boolean;
  plain?: boolean;
}) => {
  if (typeof price !== "number" || isNaN(price)) return null;

  const discountPercent =
    listPrice > 0 ? Math.round(100 - (price / listPrice) * 100) : 0;

  const discountAmount =
    listPrice > 0 ? listPrice - price : 0;

  const stringValue = price.toFixed(2);
  const [intValue, floatValue] = stringValue.includes(".")
    ? stringValue.split(".")
    : [stringValue, ""];

  const formattedPrice = (
    <div className={cn("text-2xl font-semibold text-orange-800", className)}>
      <span className="text-xs align-super">Rs </span>
      {intValue}
      <span className="text-xs align-super">.{floatValue}</span>
    </div>
  );

  const formattedListPrice = (
    <div className="text-xs text-muted-foreground line-through whitespace-nowrap">
      {currency_formate(listPrice)}
    </div>
  );

  const discountBadge = (
    <div className="text-sm font-semibold text-red-600 whitespace-nowrap">
      -{discountPercent}% off
    </div>
  );

  const savings = (
    <div className="text-xs text-green-600 font-medium">
      You save {currency_formate(discountAmount)}
    </div>
  );

  if (plain) return currency_formate(price);
  if (listPrice === 0) return formattedPrice;

  return (
    <div className="space-y-1 text-center">
      {/* ✅ Price, Discount %, List Price all in one row */}
      <div className="flex flex-wrap justify-center items-center gap-2">
        {formattedPrice}
        {formattedListPrice}
        {discountPercent > 0 && discountBadge}
      </div>

      {/* ✅ Optional savings line below */}
      {discountPercent > 0 && savings}

      {/* ✅ Extra deal message */}
      {isDeal && (
        <div className="text-xs text-red-700 font-semibold">
          Limited Time Deal!
        </div>
      )}
    </div>
  );
};

export default ProductPrice;
