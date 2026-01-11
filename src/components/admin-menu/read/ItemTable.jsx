import { useState } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { MoreHorizontal } from "lucide-react";
import EditPriceDialog from "../update/EditPriceDialog";
import DeleteAlert from "../delete/DeleteAlert";
import { deleteItemWithOptions } from "@/services/delete/deleteItemWithOptions";
import { useRestaurant } from "@/context/RestaurantContext";
import { Switch } from "@/components/ui/switch";
import { toggleIsAvailable } from "@/services/update/toggleIsAvailable";
import { formatPriceWithSymbol } from "@/utils/priceHelper";

export default function ItemTable({ items }) {
  const [editPriceOpen, setEditPriceOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const { menu, restaurantConfig } = useRestaurant();
  const options = menu?.options || [];

  const toggleAvailable = async (toggle) => {
    if (!selectedItem) return;
    try {
      await toggleIsAvailable(selectedItem.id, toggle);
      toast.success(`Marked as ${toggle ? 'not available' : 'available'}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    }

  }

  const handleDelete = async () => {
    if (!selectedItem) return;

    try {
      await deleteItemWithOptions(selectedItem.id);
      toast.success("Item deleted");
      setDeleteOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete item");
    }
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Options</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.name}</TableCell>
              <TableCell>{formatPriceWithSymbol(item.basePrice, restaurantConfig)}</TableCell>
              <TableCell>
                {(() => {
                  const itemOptions = options.filter(
                    (opt) => opt.itemId === item.id
                  );
                  return itemOptions.length > 0
                    ? itemOptions
                        .map((o) => `${o.name} (+${formatPriceWithSymbol(o.price, restaurantConfig)})`)
                        .join(", ")
                    : "—";
                })()}
              </TableCell>

              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal size={16} />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      Available <Switch checked={item.isAvailable} 
                      onCheckedChange={() => {
                        setSelectedItem(item);
                        toggleAvailable(item.isAvailable);
                      }} />
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedItem(item);
                        setEditPriceOpen(true);
                      }}
                    >
                      Edit Price
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      className="text-red-500"
                      onClick={() => {
                        setSelectedItem(item);
                        setDeleteOpen(true);
                      }}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedItem && (<EditPriceDialog
        open={editPriceOpen}
        onOpenChange={(open) => {
          setEditPriceOpen(open);
          if (!open) setSelectedItem(null);
        }}
        item={selectedItem}
      />)}

      {selectedItem && (<DeleteAlert
        open={deleteOpen}
        onOpenChange={(open) => {
          setDeleteOpen(open);
          if (!open) setSelectedItem(null);
        }}
        onDelete={handleDelete}
      />)}
    </>
  );
}
