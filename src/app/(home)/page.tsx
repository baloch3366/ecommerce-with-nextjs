// import { HomeCarousel } from "@/components/ui/shared/home/home-carousel";
// import { HomeCart } from "@/components/ui/shared/home/homeCard";
// import { getAllCategory, getProductForCard } from "@/lib/actions/product.actions";
// import { HomeBanner } from "@/lib/banner";
// import { toSlug } from "@/lib/utils";
// import { Card, CardContent } from "@/components/ui/card";
// import ProductSlider from "@/components/ui/shared/product/product-slider";

// export default async function Home() {
// // const [categoriesAll, newArrivals, featureds, bestSellers] = await Promise.all([
// //   getAllCategory(),
// //   getProductForCard({ tag: 'new-arrival', limit: 4 }),
// //   getProductForCard({ tag: 'featured', limit: 4 }),
// //   getProductForCard({ tag: 'best-seller', limit: 4 }),
// // ]);

// // const categories = categoriesAll.slice(0, 4);
// const results = await Promise.allSettled([
//   getAllCategory(),
//   getProductForCard({ tag: 'new-arrival', limit: 4 }),
//   getProductForCard({ tag: 'featured', limit: 4 }),
//   getProductForCard({ tag: 'best-seller', limit: 4 }),
// ]);

// // Unwrap results
// const categoriesAll = results[0].status === 'fulfilled' ? results[0].value : [];
// const newArrivals   = results[1].status === 'fulfilled' ? results[1].value : [];
// const featureds     = results[2].status === 'fulfilled' ? results[2].value : [];
// const bestSellers   = results[3].status === 'fulfilled' ? results[3].value : [];

// const categories = categoriesAll.slice(0, 4);

// // const cards = [
// //   {
// //     title: 'Categories to Explore',
// //     link:{
// //       text: 'See More',
// //       href: '/product',
// //     },
// //     items: categories.map((category) =>({
// //       name:category,
// //       image:`/products/${toSlug(category)}.jpg`,
// //       href:`/product?category=${category}`
// //     })),
// //   },
// //   {
// //     title: 'Explore New Arrivals',
// //     items: newArrivals,
// //     link: {
// //       text: "View All",
// //       href:'/product?category=new-arrival'
// //     }
// //   },
// //  { title: 'Discover Best Sellers',
// //   items: bestSellers,
// //   link: {
// //     text: "View All",
// //     href: '/product?category=best-seller'
// //   }
// //  },
// //  {
// //   title: 'Featured Products',
// //   items:featureds,
// //   link: {
// //     text: 'Shop Now',
// //     href: '/product?category=featured'
// //   }
// //  }
// // ]

// const cards = [
//   {
//     title: 'Categories to Explore',
//     link:{
//       text: 'See More',
//       href: '/product',
//     },
//     items: categories.map((category) =>({
//       name:category,
//       image:`/products/${toSlug(category)}.jpg`,
//       href:`/product?category=${category}`
//     })),
//   },
//   {
//     title: 'Explore New Arrivals',
//     items: newArrivals.map((p) => ({
//       ...p,
//       href: `/product/${p.slug}`,
//     })),
//     link: {
//       text: "View All",
//       href:'/product?category=new-arrival'
//     }
//   },
//   {
//     title: 'Discover Best Sellers',
//     items: bestSellers.map((p) => ({
//       ...p,
//       href: `/product/${p.slug}`,
//     })),
//     link: {
//       text: "View All",
//       href: '/product?category=best-seller'
//     }
//   },
//   {
//     title: 'Featured Products',
//     items: featureds.map((p) => ({
//       ...p,
//       href: `/product/${p.slug}`,
//     })),
//     link: {
//       text: 'Shop Now',
//       href: '/product?category=featured'
//     }
//   }
// ];

//   return (
//    <div>
//     <HomeCarousel items={HomeBanner}/>
//     <div className="md:p-4 md:space-y-4 bg-border">
//       <HomeCart cards={cards}/>
//       <Card  className ="w-full rounded-none">
//         <CardContent className="p-4 items-center gap-3">
//          <ProductSlider title="Today-Deals" products={newArrivals}/>
//         </CardContent>
//       </Card>
//     </div>
//    </div>
//   );
// }

import BrowsingHistoryList from "@/components/shared/browsing-history-list";
import { HomeCarousel } from "@/components/shared/home/home-carousel";
import { HomeCart } from "@/components/shared/home/homeCard";
import ProductSlider from "@/components/shared/product/product-slider";
import { Card, CardContent } from "@/components/ui/card";
import {
  getAllCategory,
  getProductForCard,
} from "@/lib/actions/product.actions";
import { HomeBanner } from "@/lib/banner";
import { IProduct } from "@/lib/db/model/product.model";
import { toSlug } from "@/lib/utils";

export default async function Home() {
  const [
    categoriesAllRes,
    newArrivalsRes,
    featuredRes,
    bestSellersRes,
    todaysDealsRes,
    bestSellerProductsRes,
  ] = await Promise.allSettled([
    await getAllCategory(),
    getProductForCard({ tag: "new-arrival", limit: 4 }),
    getProductForCard({ tag: "featured", limit: 4 }),
    getProductForCard({ tag: "best-seller", limit: 4 }),
    getProductForCard({ tag: "todays-deal", limit: 10 }),
    getProductForCard({ tag: "best-seller", limit: 10 }),
  ]);

  function getValue<T>(res: PromiseSettledResult<T[]>): T[] {
    return res.status === "fulfilled" ? res.value : [];
  }

  const categoriesAll = getValue(categoriesAllRes);
  const newArrivals = getValue(newArrivalsRes);
  const featureds = getValue(featuredRes);
  const bestSellers = getValue(bestSellersRes);
  const todaysDeals = getValue(todaysDealsRes);
  const bestSellerProducts = getValue(bestSellerProductsRes);

  const categories = categoriesAll.slice(0, 4);

  const productToCardItem = (product: IProduct) => ({
    ...product,
    image: product.images?.[0] || "/placeholder.jpg",
    href: `/product/${product.slug}`,
  });

  const cards = [
    {
      title: "Categories to Explore",
      link: { text: "See More", href: "/product" },
      items: categories.map((category) => ({
        name: category,
        image: `/products/${toSlug(category)}.jpg`,
        href: `/product?category=${category}`,
      })),
    },
    {
      title: "Explore New Arrivals",
      items: newArrivals.map(productToCardItem),
      link: { text: "View All", href: "/product?category=new-arrival" },
    },
    {
      title: "Discover Best Sellers",
      items: bestSellers.map(productToCardItem),
      link: { text: "View All", href: "/product?category=best-seller" },
    },
    {
      title: "Featured Products",
      items: featureds.map(productToCardItem),
      link: { text: "Shop Now", href: "/product?category=featured" },
    },
  ];

  return (
    <div className="bg-background">
      <HomeCarousel items={HomeBanner} />

      <div className="md:p-4 md:space-y-4 bg-border">
        <HomeCart cards={cards} />

        {/* ✅ Today’s Deals section */}
        <Card className="w-full rounded-none">
          <CardContent className="p-4 items-center gap-3">
            <ProductSlider title="Today-Deals" products={todaysDeals} />
          </CardContent>
        </Card>

        {/* ✅ Best Sellers section */}
        <Card className="w-full rounded-none">
          <CardContent className="p-4 items-center gap-3">
            <ProductSlider
              title="Best Selling Products"
              products={bestSellerProducts}
            />
          </CardContent>
        </Card>

        <div className="p-3 bg-background">
          <BrowsingHistoryList />
        </div>
      </div>
    </div>
  );
}
