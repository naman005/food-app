import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"
import AddItemDialog from "../create/AddItemDialog"
import ItemTable from "./ItemTable"
import { useRestaurant } from "@/context/RestaurantContext";

export default function CategoryAccordion({ categories }) {
  const { menu } = useRestaurant();
  const items = menu?.items || [];

  return (
    <Accordion type="single" className="space-y-4" collapsible>
      {categories.map((category) => {
        const categoryItems = items.filter(
          (item) => item.categoryId === category.id
        );
        return (
        <AccordionItem key={category.id} value={category.id}>
          <AccordionTrigger className="text-lg font-semibold">
            {category.name}
          </AccordionTrigger>

          <AccordionContent>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Items</CardTitle>
                <AddItemDialog categoryId={category.id} />
              </CardHeader>

              <CardContent>
                <ItemTable items={categoryItems} />
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>
        )}
      )}
    </Accordion>
  );
}
