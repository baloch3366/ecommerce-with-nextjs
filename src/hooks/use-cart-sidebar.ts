
import { usePathname } from "next/navigation"
import { useCartStore } from "./use-cart-store"
import UseDeviceType from "./use-device-type"

const hiddenPaths = ['/', '/checkout', '/sign-in', '/sign-up']

 export default function useCartSidebar() {
  const { cart: { items } } = useCartStore()
  const deviceType = UseDeviceType()
  const path = usePathname()
  // console.log('Device Type:', deviceType)
  // console.log('Pathname:', path)


  const isVisible =
    items.length > 0 &&
    deviceType !== 'mobile' &&
    !hiddenPaths.includes(path)

  return isVisible
}

