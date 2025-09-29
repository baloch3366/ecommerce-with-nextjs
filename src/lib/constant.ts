export const APP_NAME = process.env.NEXT_APP_NAME || "nextjs15"
export const APP_DESCRIPTION = process.env.NEXT_APP_DESCRIPTION || "Ecommerce"

export const PAGE_SIZE = Number(process.env.PAGE_SIZE || 9)

export const FREE_SHIPPING_MIN_PRICE=Number(process.env.FREE_SHIPPING_MIN_PRICE || 35)

export const AVAILABLE_PAYMENT_METHODS = [
    {
        name: 'PayPal',
        commission: 0,
        isDefault: true,
    },
    {
        name: 'Stripe',
        commission: 0,
        isDefault: true,
    },
    {
        name: 'Cash On Delivery',
        commission: 0,
        isDefault: true,
    },
]

export const AVAILABLE_DELIVERY_DATES = [
    {
        name: 'Tomorrow',
        daysToDeliver: 1,
        shippingPrice: 12.9,
        freeShippingMinPrice: 0,
    },
    {
        name: 'Next 3 Days',
        daysToDeliver: 3,
        shippingPrice: 6.9,
        freeShippingMinPrice: 0,
    },
    {
        name: 'Next 5 Days',
        daysToDeliver: 5,
        shippingPrice: 4.9,
        freeShippingMinPrice: 35,
    },
]


export const SERVER_URL=process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000/'

export const SENDER_EMAIL=process.env.RESEND_EMAIL || 'jackleelive1989@gmail.com'

export const SENDER_NAME = process.env.RESEND_NAME || 'Shopping'


export const STRIPE_PUBLIC_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY
export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY
export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET

//paypalemail = sb-xtgho45882882@business.example.com