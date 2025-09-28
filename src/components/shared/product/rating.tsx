
import { Star } from "lucide-react";


type RatingProps = {
    rating: number;
    size? : number;
}

// export default function Rating({rating, size = 6                       ````````}:RatingProps) {
//   const fullStars = Math.floor(rating);
//   const partialStar = rating % 1;
//   const emptyStars = 5 - Math.ceil(rating);

//   const sizeClass = `w-${size} h-${size}`;

//   return(
//     <div className="flex items-center" aria-label={`Rating: ${(rating ?? 0).toFixed(1)}`}>
//     {
//         [...Array(fullStars)].map((_, i)=> (
//             <Star 
//             key={`full-${i}`}
//             className={`${sizeClass} fill-primary text-primary`}/>
//         ))
//     } 
//     {partialStar > 0 && (
//         <div className={`relative ${sizeClass}`}>
//             <Star className={`${sizeClass} text-primary`}/>
//              <div className="absolute top-0 left-0 overflow-hidden"
//              style={{width: `${partialStar * 100}%`}}
//              >
//               <Star className={`${sizeClass} fill-primary`}/>
//              </div>
//         </div>
//     )}
//     {
//         [...Array(emptyStars)].map((_, i)=> (
//             <Star key={`empty-${i}`}
//             className={`${sizeClass} text-primary`}
//             />
//         ))
//     }   
//     </div>
//   )
// }

export default function Rating({ rating, size = 6 }: RatingProps) {
  const safeRating = typeof rating === "number" && isFinite(rating) && rating >= 0 ? rating : 0;

  const fullStars = Math.floor(safeRating);
  const partialStar = safeRating % 1;
  const emptyStars = 5 - Math.ceil(safeRating);


  return (
    <div className="flex items-center gap-0.5" aria-label={`Rating: ${safeRating.toFixed(1)}`}>
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} className={`w-${size} h-${size} fill-primary text-primary`} />
      ))}
      {partialStar > 0 && (
        <div className={`relative w-${size} h-${size}`}>
          <Star className={`w-${size} h-${size} text-primary`} />
          <div
            className="absolute top-0 left-0 overflow-hidden"
            style={{ width: `${partialStar * 100}%` }}
          >
            <Star className={`w-${size} h-${size} fill-primary`} />
          </div>
        </div>
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} className={`w-${size} h-${size} text-primary opacity-40`} />
      ))}
    </div>
  );
}
