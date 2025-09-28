'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { AVAILABLE_PAYMENT_METHODS } from '@/lib/constant'

type Props = {
  value: string
  onChange: (value: string) => void
  onConfirm: () => void
}

export default function CheckoutPaymentMethod({ value, onChange, onConfirm }: Props) {
  return (
    <Card className="md:ml-8 my-4">
      <CardContent className="p-4">
        <RadioGroup value={value} onValueChange={onChange}>
          {AVAILABLE_PAYMENT_METHODS.map((pm) => (
            <div key={pm.name} className="flex items-center py-1">
              <RadioGroupItem value={pm.name} id={`payment-${pm.name}`} />
              <Label htmlFor={`payment-${pm.name}`} className="font-bold pl-2 cursor-pointer">
                {pm.name}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
      <CardFooter className="p-4">
        <Button onClick={onConfirm} className="rounded-full font-bold">
          Use this payment method
        </Button>
      </CardFooter>
    </Card>
  )
}

