'use client'

import { useState } from 'react'
import CheckoutAddressForm from './CheckoutAddressForm'
import CheckoutPaymentMethod from './CheckoutPaymentMethod'
import {useCartStore} from '@/hooks/use-cart-store'
import { ShippingAddress } from '@/types'
import CheckoutItems from './checkoutItem'
import CheckoutSummary from './checkoutSummary'
import CheckoutFooter from './checkout-footer'

export default function CheckoutForm() {
  const { cart, setShippingAddress, setPaymentMethod } = useCartStore()
  const [isAddressSelected, setIsAddressSelected] = useState(false)
  const [isPaymentMethodSelected, setIsPaymentMethodSelected] = useState(false)

  return (
    <main className="max-w-6xl mx-auto highlight-link">
      {/* address step */}
      {!isAddressSelected && (
        <CheckoutAddressForm
          defaultValues={cart.shippingAddress || { fullName:'', street:'', city:'', phone:'', postalCode:'', country:'' }}
          onAddressSubmit={(values: ShippingAddress) => {
            setShippingAddress(values)
            setIsAddressSelected(true)
          }}
        />
      )}

      {/* payment method */}
      {isAddressSelected && !isPaymentMethodSelected && (
        <CheckoutPaymentMethod
          value={cart.paymentMethod ?? ""}
          onChange={(v) => setPaymentMethod(v)}
          onConfirm={() => setIsPaymentMethodSelected(true)}
        />
      )}

      {/* items + summary */}
      {isPaymentMethodSelected && (
        <>
          <CheckoutItems />
          <CheckoutSummary />
        </>
      )}

      <CheckoutFooter />
    </main>
  )
}
