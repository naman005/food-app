import { Plus, Minus } from "lucide-react"

export function QuantityControl({ onIncrease, onDecrease, quantity }) {
  return (
    <div className="flex items-center justify-between w-1/5 border border-gray-200 rounded-md px-2 py-2">
          <button
            onClick={onDecrease}
            disabled={quantity === 1}
            className="text-gray-600 disabled:opacity-40"
          >
            <Minus size={15} />
          </button>

          <span className="text-sm font-medium">{quantity}</span>

          <button onClick={onIncrease} className="text-gray-600">
            <Plus size={15} />
          </button>
        </div>
  )
}
