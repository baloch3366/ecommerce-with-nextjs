
// import AddItemToCart from "./add-item-to-cart";

// export default function AddItemToCartPage({ params }: { params: { itemId: string } }) {
//   return <AddItemToCart itemId={params.itemId} />
// }

import AddItemToCart from "./add-item-to-cart";

export default async function AddItemToCartPage({params}:{params:Promise<{itemId: string}>}){
    const {itemId} = await params;
    // console.log("itemId", itemId)
    return(
        <AddItemToCart itemId={itemId} />
    )
}