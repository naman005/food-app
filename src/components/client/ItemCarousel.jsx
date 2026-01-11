import { useState, useEffect } from "react"; 
import CarouselSlide from "./CarouselSlide";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

export default function ItemCarousel({
  items,
  options,
  selectedCategory,
  onAddItem,
  restaurantConfig,
}) {
  const [api, setApi] = useState(null);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  if (!selectedCategory) return null;

  const categoryItems = items.filter(
    (item) => item.categoryId === selectedCategory.id
  );

  return (
    <div className="flex items-center justify-center bg-white">
      <div className="max-w-xs">
        <Carousel setApi={setApi}>
          <CarouselContent className="flex items-center">
            {categoryItems.map((item, index) => {
              const itemOptions = options.filter(
                (opt) => opt.itemId === item.id
              );

              return (
                <CarouselItem
                  key={index}
                  className="flex flex-col h-full w-full"
                >
                  <div className="w-full h-full">
                    <CarouselSlide
                      item={item}
                      options={itemOptions}
                      onAdd={onAddItem}
                      restaurantConfig={restaurantConfig}
                    />
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>

          <CarouselPrevious />
          <CarouselNext />
        </Carousel>

        <CarouselIndicators
          items={categoryItems}
          activeIndex={current}
          scrollTo={(index) => api?.scrollTo(index)}
        />
      </div>
    </div>
  );
}

const CarouselIndicators = ({ items, activeIndex, scrollTo }) => {
  return (
    <div className="flex justify-center gap-2 py-4 shrink-0">
      {items.map((_, idx) => (
        <button
          key={idx}
          onClick={() => scrollTo(idx)}
          className={`h-2 rounded-full transition-all duration-200 cursor-pointer border-none p-0
            ${idx === activeIndex 
              ? "w-4 bg-black" 
              : "w-2 bg-gray-300 hover:bg-gray-400"
            }`}
          aria-label={`Go to slide ${idx + 1}`}
        />
      ))}
    </div>
  );
};