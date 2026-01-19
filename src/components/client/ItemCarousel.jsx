import { useState, useEffect } from "react"; 
import { motion } from "framer-motion";
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

  const categoryItems = items.filter(
    (item) => item.categoryId === selectedCategory.id
  );

  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  useEffect(() => {
    if (!api) return;
  
    if (current >= categoryItems.length) {
      api.scrollTo(0, true);
      setCurrent(0);
    }
  }, [categoryItems.length, current, api]);
  

  if (!selectedCategory) return null;


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
                  <motion.div
                      className="w-full h-full"
                      animate={{
                        scale: index === current ? 1 : 0.965,
                        opacity: index === current ? 1 : 0,
                        y: index === current ? 0 : 8,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 420,
                        damping: 32,
                        mass: 0.9,
                      }}
                      style={{
                        pointerEvents: index === current ? "auto" : "none",
                      }}
                    >
                    <CarouselSlide
                      item={item}
                      options={itemOptions}
                      onAdd={onAddItem}
                      restaurantConfig={restaurantConfig}
                    />
                  </motion.div>
                </CarouselItem>
              );
            })}
          </CarouselContent>

          <CarouselPrevious className="hidden sm:flex" />
          <CarouselNext className="hidden sm:flex" />
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