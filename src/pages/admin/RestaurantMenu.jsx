import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner";
import { ArrowLeftIcon } from "lucide-react"
import CategoryAccordion from "@/components/admin-menu/read/CategoryAccordion"
import CategoryList from "@/components/admin-menu/read/CategoryList"
import { NavLink } from "react-router-dom";
import { useRestaurant } from "@/context/RestaurantContext";

export default function RestaurantMenu() {
  const { menu, loadingMenu } = useRestaurant();

  const categories = menu?.categories || [];

  return (
    <div className="relative min-h-screen">
      {loadingMenu ? (
        <div className="absolute inset-0 flex justify-center items-center">
          <Spinner className="size-6" />
        </div>
      ) : ( 
      <div className="p-6 max-w-6xl mx-auto">
      <NavLink to="/">
      <Button variant="outline" size="icon" aria-label="Go Back" className="mb-6">
        <ArrowLeftIcon />
      </Button>
      </NavLink>
      <Tabs defaultValue="items">
        <TabsList>
          <TabsTrigger value="items">Items</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="items" className="mt-6">
          <CategoryAccordion categories={categories} />
        </TabsContent>

        <TabsContent value="categories" className="mt-6">
          <CategoryList categories={categories} />
        </TabsContent>
      </Tabs>
      </div>
      )}
    </div>
  );
}



