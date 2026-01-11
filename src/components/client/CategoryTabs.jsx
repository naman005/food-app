
export default function CategoryTabs({
  categories,
  selectedCategory,
  onSelectCategory
}) {

  const isScrollable = categories.length > 4;

  return (
    <div className="w-full mt-2">
      <div className={`flex ${isScrollable ? "overflow-x-auto hide-scrollbar justify-evenly" : "justify-center"}`}>
        <div className={`flex ${isScrollable ? "min-w-max px-4" : ""}`}>
          {categories.map((category) => {
            const isActive = selectedCategory === category;
            return (
              <div
                key={category.id}
                onClick={() => onSelectCategory(category)}
                className={`
                  cursor-pointer
                  px-6
                  py-3
                  text-sm
                  font-semibold
                  tracking-wide
                  whitespace-nowrap
                  transition-colors
                  ${
                    isActive
                      ? "bg-white text-black border-t-2 border-t-black shadow-[0_-4px_12px_rgba(0,0,0,0.22)] border-b-0"
                      : "text-gray-500 hover:text-gray-700 border-b border-gray-200"
                  }
                `}
              >
                {category.name}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
