import { QuantityControl } from "@/components/client/QuantityControl";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { placeOrder } from "@/services/create/placeOrder";
import { formatPriceWithCode, formatPriceWithSymbol } from "@/utils/priceHelper";
import { X } from "lucide-react";
import { useState } from "react";

export default function CartPage({ cart, controls, restaurantId, restaurantConfig, orderType, tableNo, onClose, onNewOrder }) {
  const [loading, setLoading] = useState(false);
  const [isPlaceOpen, setIsPlaceOpen] = useState(false);
  const [tokenNo, setTokenNo] = useState(0);

  const total = cart.reduce((sum, c) => sum + (c.price + c.optionPrice) * c.qty, 0);

  const showTaxCalc = restaurantConfig.tax.enabled && !restaurantConfig.tax.pricesIncludeTax;
  const showPriceInclusive = restaurantConfig.tax.enabled && restaurantConfig.tax.pricesIncludeTax;
  const taxPercentage = Number(restaurantConfig.tax.percentage);
  const taxName = restaurantConfig.tax.name;

  const confirmOrder = async () => {
    setLoading(true);
    try {
      const totalAmount = showTaxCalc ? (total + (total * taxPercentage/100)) : total; 
      await placeOrder(restaurantId, cart, orderType, tableNo, totalAmount, setTokenNo);
      setIsPlaceOpen(true);
    } catch(err) {
      console.error(err)
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen mx-auto max-w-md flex flex-col">

      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="space-y-6">
          {cart.map((c, index) => (
            <div key={index} className="border rounded-xl p-4 relative bg-gray-50">
              <button
                className="absolute top-3 right-3 text-gray-400"
                onClick={() => controls.removeItem(index)}
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex justify-between text-sm text-gray-500">
                  {c.name}
                  {c.optionName !== "default" && ` (${c.optionName})`}
                  {" "}x {c.qty}
              </div>

              <Separator className="my-3" />

              <div className="flex justify-between items-center text-sm font-normal">
                <QuantityControl
                  onIncrease={() => controls.addOne(index)}
                  onDecrease={() => controls.removeOne(index)}
                  quantity={c.qty}
                />
                <span>{formatPriceWithSymbol(((c.price + c.optionPrice) * c.qty), restaurantConfig)}</span>
              </div>
            </div>
          ))}

        </div>
      </div>
          <div className="bg-white sticky bottom-0 border-t p-4 space-y-3">
            {showTaxCalc && (
              <>
            <div className="flex justify-between items-center">
              <span className="text-sm font-normal">
                Sub-Total
              </span>
              <span className="text-sm font-normal">
                {formatPriceWithSymbol(total, restaurantConfig)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <i className="text-xs">
                {taxName}
              </i>
              <span className="text-xs font-light">
                {formatPriceWithSymbol(total * taxPercentage/100, restaurantConfig)}
              </span>
            </div>
            </>
            )}
            <div className="flex justify-between items-center">
              <span className="text-base font-medium">
                Total {showPriceInclusive && <i className="text-xs font-light">inclusive {taxName}</i>}
              </span>
              <span className="text-md font-semibold">
                {showTaxCalc ? formatPriceWithCode((total + (total * taxPercentage/100)), restaurantConfig) : formatPriceWithCode(total, restaurantConfig)}
              </span>
            </div>
            <Button onClick={onClose} variant="outline" className="w-full">
              Continue Shopping
            </Button>
            <Button onClick={confirmOrder} className="w-full" disabled={loading}>
              {loading ? "Placing Order..." : "Place Order"}
            </Button>
            {isPlaceOpen && <PlaceOrderPage tokenNo={tokenNo} onNewOrder={onNewOrder} />}
          </div>
    </div>
  );
}

function PlaceOrderPage({ tokenNo, onNewOrder }) {
  return (
    <div className="fixed inset-0 bg-white h-full w-full">
    <div className="flex flex-col items-center justify-center space-y-6 h-full w-full">
      <span className="text-4xl font-extrabold">{tokenNo}</span>
      <span className="text-sm text-center font-normal">Show your token, pay at the counter, and wait</span>
      <Button className="w-full max-w-xs" onClick={onNewOrder}>Place New Order</Button>
    </div>
    </div>
  )
}
 