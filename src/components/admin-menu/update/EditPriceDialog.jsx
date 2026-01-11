import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { updateItemPrices } from "@/services/update/updateItemPrices"

export default function EditPriceDialog({ open, onOpenChange, item }) {
  const [basePrice, setBasePrice] = useState(item.basePrice);
  const [options, setOptions] = useState(item.options || []);
  const [loading, setLoading] = useState(false);

  const updateOptionPrice = (i, value) => {
    const updated = [...options];
    updated[i].price = value;
    setOptions(updated);
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      await updateItemPrices({
        itemId: item.id,
        basePrice,
        options,
      });

      toast.success("Prices updated");
      onOpenChange(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update prices");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Prices</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input disabled value={item.name} />

          <div className="space-y-2">
            <Label>Base Price</Label>
            <Input
              type="text"
              value={basePrice}
              onChange={(e) => setBasePrice(e.target.value)}
            />
          </div>

          {options.map((opt, i) => (
            <div key={i} className="flex gap-2 items-center">
              <Input disabled value={opt.name} />
              <Input
                type="text"
                value={opt.price}
                onChange={(e) =>
                  updateOptionPrice(i, e.target.value)
                }
              />
            </div>
          ))}

          <Button
            className="w-full"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Prices"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
