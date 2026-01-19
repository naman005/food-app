import { Button } from "@/components/ui/button";
import { formatPriceWithSymbol } from "@/utils/priceHelper";
import { CheckCircleIcon } from "lucide-react";
import { useState, useEffect } from "react";

export default function CarouselSlide({
  item,
  options,
  onAdd,
  restaurantConfig,
}) {
  const [showCheck, setShowCheck] = useState(false);
  const [selectedOption, setSelectedOption] = useState({
    name: "default",
    price: 0,
  });

  const handleOptionClick = option => selectedOption?.id === option.id ? setSelectedOption({ name: "default", price: 0 }) : setSelectedOption(option);

  const handleAdd = () => {
    onAdd(item, selectedOption);
    setShowCheck(true);

    setTimeout(() => {
      setShowCheck(false);
    }, 800);
  };


  useEffect(() => setSelectedOption({ name: "default", price: 0 }), [item.id]);

  return (
    <div className="relative flex flex-col w-full h-full overflow-hidden">
    <span
      className={`
        absolute inset-0 flex justify-center -top-10 z-30
        transition-all duration-200 ease-out
        ${showCheck
          ? "opacity-100 translate-y-16"
          : "opacity-0 translate-y-0 pointer-events-none"}
      `}
    >
      <CheckCircleIcon />
    </span>

      {/* PRICE + ADD */}
      <div className="flex justify-between items-center px-2 py-2 shrink-0">
        <span className="text-base font-medium">
          {formatPriceWithSymbol(item.basePrice + selectedOption.price, restaurantConfig)}
        </span>

        <Button
          onClick={handleAdd}
          className="rounded-full px-4 text-sm"
        >
          Add
        </Button>
      </div>
      <div className="flex items-center justify-center px-2">
        <div className="absolute text-7xl font-extrabold text-white text-center leading-[1em] text-shadow-[0_6px_12px_rgba(0,0,0,0.2)] z-10">
          {item.name}
        </div>
        <img
          src={item.imageUrl}
          alt={item.name}
          className="max-h-full max-w-full z-20 object-contain"
        />
      </div>

      {options.length > 0 && (
        <div className="py-2 flex justify-center gap-3 flex-wrap shrink-0">
          {options.map(o => {
            const isSelected = selectedOption?.id === o.id;

            return (
              <Button
                key={o.id}
                variant="outline"
                onClick={() => handleOptionClick(o)}
                className={`px-4 text-sm rounded-lg
                  ${isSelected
                    ? "border-2 border-black"
                    : "border-gray-300"}`}
              >
                {o.name}
              </Button>
            );
          })}
        </div>
      )}
    </div>
  );
}
