import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"
import { useState } from "react"
import { addItem } from "@/services/create/addItem"
import { useRestaurant } from "@/context/RestaurantContext"
import { toast } from "sonner"

export default function AddItemDialog({ categoryId }) {
  const [name, setName] = useState("");
  const [foodType, setFoodType] = useState("Veg");
  const [basePrice, setBasePrice] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { restaurantId, restaurantConfig } = useRestaurant();

  const addOption = () => {
    setOptions([...options, { name: "", price: "" }]);
  };

  const updateOption = (index, field, value) => {
    const updated = [...options];
    updated[index][field] = value;
    setOptions(updated);
  };

  const removeOption = (index) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const saveItem = async () => {
    try {
      setLoading(true);
      await addItem({ restaurantId, categoryId, name, foodType, basePrice, imageFile, options });
      toast.success("Item saved, Login again to view item");
    } catch(err) {
      console.error(err);
      toast.error("Failed, try again later")
    } finally {
      setLoading(false);
      resetItem();
      setOpen(false);
    }

  };

  const resetItem = () => {
    setName("");
    setFoodType("Veg");
    setBasePrice("");
    setImageFile(null);
    setOptions([]);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (!isOpen) resetItem();
    }}>
      <DialogTrigger asChild>
        <Button size="sm">+ Add Item</Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Item</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="Item name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
              {restaurantConfig?.foodPreferences.showVegNonVeg && (  
                <RadioGroup
                  value={foodType}
                  onValueChange={(value) => setFoodType(value)}
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
            value={basePrice}
            onChange={(e) => setBasePrice(e.target.value)}
          />

          <Input 
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
          />


          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="font-medium">Options (optional)</p>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={addOption}
              >
                + Add Option
              </Button>
            </div>

            {options.map((opt, index) => (
              <div
                key={index}
                className="flex gap-2 items-center"
              >
                <Input
                  placeholder="Option name"
                  value={opt.name}
                  onChange={(e) =>
                    updateOption(index, "name", e.target.value)
                  }
                />

                <Input
                  type="text"
                  placeholder="Price +"
                  value={opt.price}
                  onChange={(e) =>
                    updateOption(index, "price", e.target.value)
                  }
                />

                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={() => removeOption(index)}
                >
                  <X size={16} />
                </Button>
              </div>
            ))}
          </div>

          <Button className="w-full" onClick={saveItem} disabled={loading}>
            {loading ? "Saving..." : "Save Item"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
