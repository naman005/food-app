import { useEffect, useState, Suspense, lazy } from "react"
import { useParams } from "react-router-dom"
import { useRestaurant } from "@/context/RestaurantContext"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import CategoryTabs from "@/components/client/CategoryTabs"
const ItemCarousel = lazy(() => import("@/components/client/ItemCarousel"));
import BottomBar from "@/components/client/BottomBar"
import CartPage from "./CartPage"
import { Spinner } from "@/components/ui/spinner"
import { ClientSkeleton, ItemSkeleton } from "@/components/client/ClientSkeleton"

export default function ClientHomePage() {
  const { restaurantId } = useParams();
  const { menu, restaurantConfig, loadingMenu} = useRestaurant();

  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [orderType, setOrderType] = useState('default');
  const [tableNo, setTableNo] = useState(0);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOrderTypeOpen, setIsOrderTypeOpen] = useState(true);
  const [isTableOpen, setIsTableOpen] = useState(false);

  const [bothOrderModesEnabled, setBothOrderModesEnabled] = useState(false);
  const [tableEnabled, setTableEnabled] = useState(false);

  const [selectedFoodType, setSelectedFoodType] = useState("All");
  const [toggle, setToggle] = useState(false);


  useEffect(() => {
    if (!menu || !restaurantConfig) return;

    const dineInEnabled = restaurantConfig.orderModes.dineIn.enabled;
    const takeawayEnabled = restaurantConfig.orderModes.takeaway.enabled;

    setBothOrderModesEnabled(!!(dineInEnabled && takeawayEnabled));

    setTableEnabled(!!(dineInEnabled && restaurantConfig.orderModes.dineIn.tableNumberRequired));

    if (menu.categories?.length > 0 && !selectedCategory) {
      setSelectedCategory(menu.categories[0]);
    }
  }, [menu, restaurantConfig]);

    if (loadingMenu || !menu || !restaurantConfig) {
    return (
      <div className="h-screen w-full flex justify-center items-center">
        <ClientSkeleton />
      </div>
    )
  }

  function handleNewOrder() {
    setCart([])
    setTableNo(0)
    setOrderType('default')

    setIsCartOpen(false)
    setIsTableOpen(false)

    if (bothOrderModesEnabled) {
      setIsOrderTypeOpen(true)
    } else {
      setIsOrderTypeOpen(false)
    }
  }



  const availableItems = menu?.items.filter(
    item => item.isAvailable === true
  );

  const filteredVegItems = availableItems.filter(
    item => item.foodType === "Veg"
  );

  const handleToggleChange = (val) => {
    setToggle(val);
    setSelectedFoodType(val ? "Veg" : "All");
  };

  const menuItems = (selectedFoodType == "Veg") ? filteredVegItems : availableItems;

  function addToCart(item, option) {
  setCart(prev => {
    const existing = prev.find(
      i => i.itemId === item.id && i.optionName === option.name
    );

    if (existing) {
      return prev.map(i =>
        i === existing ? { ...i, qty: i.qty + 1 } : i
      );
    }

    return [
      ...prev,
      {
        itemId: item.id,
        name: item.name,
        price: item.basePrice,
        optionName: option.name,
        optionPrice: option.price,
        qty: 1
      }
      ];
    });
  }

  function controls() {
    const addOne = (index) => setCart(prev => prev.map((item, i) => i === index ? { ...item, qty: item.qty + 1 } : item));

    const removeOne = (index) => setCart(prev => prev.map((item, i) => i === index ? { ...item, qty: item.qty - 1 } : item).filter(item => item.qty > 0));

    const removeItem = (index) => setCart(prev => prev.filter((_, i) => i !== index));

    return {addOne, removeOne, removeItem };  
  }
 
  const cartControls = controls();

  const grandTotal = cart.reduce((sum, c) => sum + (c.price + c.optionPrice) * c.qty, 0);

  return (
    <div className="h-screen flex flex-col bg-white">

      {/* {bothOrderModesEnabled && isOrderTypeOpen && (
        <div className="fixed inset-0 bg-white z-30">
          <div className="flex items-center justify-center min-h-screen mx-auto max-w-md gap-8">
          <Button 
            size="lg"
            variant="outline"
            className="font-semibold tracking-wide text-sm px-10"
            onClick={() => {
              setOrderType("DINE-IN");
              tableEnabled ? setIsTableOpen(true) : setIsOrderTypeOpen(false);
            }}
          >
            Dine-in
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            className="font-semibold tracking-wide text-sm px-10"
            onClick={() => {
              setOrderType("TAKEAWAY");
              setIsOrderTypeOpen(false);
            }}
          >
            Takeaway
          </Button>
          </div>
        </div>
      )}

      {tableEnabled && isTableOpen && (
        <div className="fixed inset-0 bg-white z-40">
          <div className="flex flex-col items-center justify-center min-h-screen mx-auto max-w-sm space-y-10 bg-white p-4">
            <div className="flex justify-center items-center w-full">
              <Label htmlFor="tableNo" className="font-semibold text-sm w-1/2">Table No.</Label>
              <Input type="number" className="w-1/2" placeholder="your table no." onChange={(e) => setTableNo(e.target.value)} />
            </div>
            <Button 
              className="w-full"
              onClick={() => {
                setIsTableOpen(false)
                setIsOrderTypeOpen(false)
            }}> 
              Continue
            </Button>
          </div>
        </div>
      )}

      {restaurantConfig.foodPreferences.showVegNonVeg && (
        <div className="flex justify-center py-4 shrink-0">
          <div className="flex items-center gap-2">
            <Label className="text-sm font-normal tracking-wide text-gray-500">Vegetarian</Label>
            <Switch
              checked={toggle}
              onCheckedChange={() => handleToggleChange(!toggle)}
            />
          </div>
        </div>
      )} */}

      <div className="shrink-0">
        <CategoryTabs categories={menu.categories} selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />
      </div>

      <div className="flex-1 flex justify-center items-center bg-white">
      <Suspense fallback={<ItemSkeleton />}>
        <ItemCarousel
          items={menuItems}
          options={menu.options}
          selectedCategory={selectedCategory}
          onAddItem={addToCart}
          restaurantConfig={restaurantConfig}
        />
        </Suspense>    
      </div>

      <div className="h-16 shrink-0" />

      <div className="fixed bottom-0 left-0 w-full z-10">
        <BottomBar
          grandTotal={grandTotal}
          restaurantConfig={restaurantConfig}
          onViewCart={() => setIsCartOpen(true)}
        />
      </div>

      {isCartOpen && (
        <div className="fixed inset-0 bg-white overflow-scroll z-50">
          <CartPage
            cart={cart}
            controls={cartControls}
            restaurantId={restaurantId}
            restaurantConfig={restaurantConfig}
            orderType={orderType}
            tableNo={tableNo}
            onClose={() => setIsCartOpen(false)}
            onNewOrder={handleNewOrder}
          />
        </div>
      )}

    </div>
  )
}

