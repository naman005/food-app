import { Button } from "@/components/ui/button"
import { formatPriceWithCode } from "@/utils/priceHelper"
import { ShoppingCart } from "lucide-react"

export default function BottomBar({ grandTotal, restaurantConfig, onViewCart }) {
  const showTaxLabel = restaurantConfig.tax.enabled && !restaurantConfig.tax.pricesIncludeTax;
  return (
    <div className="w-full bg-white px-4 py-3 shadow-[0_-6px_12px_rgba(0,0,0,0.12)]">
      <div className="flex items-center gap-5">
        <Button
          onClick={onViewCart}
          variant="outline"
          className="
            w-3/4
            h-12
            rounded-md
            shadow-sm
          "
        >
          <ShoppingCart />
        </Button>

        <div className="w-1/4 text-center">
          <p className="text-md font-semibold text-black">
            {formatPriceWithCode(grandTotal, restaurantConfig)}
          </p>
          {showTaxLabel && grandTotal !== 0 && <i className="text-xs">+ taxes</i>}
        </div>
      </div>
    </div>
  )
}

