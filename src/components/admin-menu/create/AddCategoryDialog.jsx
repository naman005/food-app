import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addCategory } from "@/services/create/addCategory";
import { toast } from "sonner";
import { useRestaurant } from "@/context/RestaurantContext";

export default function AddCategoryDialog() {
  const { restaurantId, restaurantConfig } = useRestaurant();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState({
    name: "",
    items: [],
  });

  const addItem = () => {
    setCategory((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { name: "", foodType: "Veg", basePrice: "", imageFile: null, options: [] },
      ],
    }));
  };

  const addOption = (itemIndex) => {
  setCategory((prev) => ({
    ...prev,
    items: prev.items.map((item, idx) =>
      idx === itemIndex
        ? {
            ...item,
            options: [...item.options, { name: "", price: "" }],
          }
        : item
      ),
    }));
  };

  const updateItem = (index, field, value) => {
    setCategory((prev) => {
      const items = [...prev.items];
      items[index][field] = value;
      return { ...prev, items };
    });
  };

  const updateOption = (itemIndex, optionIndex, field, value) => {
    setCategory((prev) => {
      const items = [...prev.items];
      items[itemIndex].options[optionIndex][field] = value;
      return { ...prev, items };
    });
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await addCategory({ restaurantId, category });
      toast.success("Category added, Login again to view category");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add category");
    } finally {
      setLoading(false);
      resetCategory();
      setOpen(false);
    }
  };

  const resetCategory = () => {
    setCategory({
      name: "",
      items: [],
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (!isOpen) resetCategory();
    }}>
      <DialogTrigger asChild>
        <Button size="sm">+ Add Category</Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Category</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="Category name"
            value={category.name}
            onChange={(e) =>
              setCategory({ ...category, name: e.target.value })
            }
          />

          {category.items.map((item, itemIndex) => (
            <div key={itemIndex} className="border p-3 rounded space-y-2">
              <Input
                placeholder="Item name"
                value={item.name}
                onChange={(e) =>
                  updateItem(itemIndex, "name", e.target.value)
                }
              />
              {restaurantConfig.foodPreferences.showVegNonVeg && (  
                <RadioGroup
                  value={item.foodType}
                  onValueChange={(value) =>
                    updateItem(itemIndex, "foodType", value)
                  }
                  className="flex gap-6"
                >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="Veg" />
                <Label>Veg</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="Non-Veg" />
                <Label>Non Veg</Label>
              </div>
            </RadioGroup>)}

              <Input
                type="text"
                placeholder="Base price"
                value={item.basePrice}
                onChange={(e) =>
                  updateItem(itemIndex, "basePrice", e.target.value)
                }
              />

              <Input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  updateItem(itemIndex, "imageFile", e.target.files[0])
                }
              />

              {item.options.map((opt, optIndex) => (
                <div key={optIndex} className="flex gap-2">
                  <Input
                    placeholder="Option name"
                    value={opt.name}
                    onChange={(e) =>
                      updateOption(itemIndex, optIndex, "name", e.target.value)
                    }
                  />
                  <Input
                    type="text"
                    placeholder="Price +"
                    value={opt.price}
                    onChange={(e) =>
                      updateOption(itemIndex, optIndex, "price", e.target.value)
                    }
                  />
                </div>
              ))}

              <Button
                size="sm"
                variant="outline"
                onClick={() => addOption(itemIndex)}
              >
                + Add Option
              </Button>
            </div>
          ))}

          <Button size="sm" variant="outline" onClick={addItem}>
            + Add Item
          </Button>

          <Button className="w-full" onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save Category"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
