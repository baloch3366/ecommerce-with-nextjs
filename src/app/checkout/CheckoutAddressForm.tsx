'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, SubmitHandler } from 'react-hook-form'
import { ShippingAddressSchema } from '@/lib/validator'
import { ShippingAddress } from '@/types'

type CheckoutAddressFormProps = {
  defaultValues: ShippingAddress
  onAddressSubmit: (values: ShippingAddress) => void
}

export default function CheckoutAddressForm({ defaultValues, onAddressSubmit }: CheckoutAddressFormProps) {
  const form = useForm<ShippingAddress>({
    resolver: zodResolver(ShippingAddressSchema),
    defaultValues,
  })

  const handleSubmit: SubmitHandler<ShippingAddress> = (values) => onAddressSubmit(values)

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <Card className="md:ml-8 my-4">
          <CardContent className="p-4 space-y-2">
            <div className="text-lg font-bold mb-2">Your address</div>

            <FormField control={form.control} name="fullName" render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Full Name</FormLabel>
                <FormControl><Input placeholder="Enter full name" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="street" render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Street</FormLabel>
                <FormControl><Input placeholder="Enter street" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <div className="flex flex-col gap-5 md:flex-row">
              <FormField control={form.control} name="city" render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>City</FormLabel>
                  <FormControl><Input placeholder="Enter city" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="country" render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Country</FormLabel>
                  <FormControl><Input placeholder="Enter country" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <div className="flex flex-col gap-5 md:flex-row">
              <FormField control={form.control} name="postalCode" render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Postal Code</FormLabel>
                  <FormControl><Input placeholder="Enter postal code" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="phone" render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl><Input placeholder="Enter phone number" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
          </CardContent>
          <CardFooter className="p-4">
            <Button type="submit" className="rounded-full font-bold">
              Ship to this address
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}

