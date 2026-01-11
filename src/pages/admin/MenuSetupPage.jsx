import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertTitle } from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"

import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group"
import { toast } from "sonner"
import { X, AlertCircleIcon } from "lucide-react";
import { saveRestaurantSetup } from "@/services/create/saveRestaurantSetup";
import { uploadToCloudinary } from "@/utils/uploadToCloudinary";
import { firebaseAuth } from "@/firebase/firebaseUtils";
import { useAuth } from "@/context/AuthContext";
import { useRestaurant } from "@/context/RestaurantContext";
import { useNavigate } from "react-router-dom";

export default function MenuSetupPage() {
  const { logout } = useAuth();
  const { restaurantId } = useRestaurant(); 
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState("");
  const [restaurantName, setRestaurantName] = useState("");
  const [categories, setCategories] = useState([
    {
      name: "",
      items: [
        {
          name: "",
          foodType: "Veg",
          basePrice: "",
          imageFile: null,
          imageUrl: "",
          options: [],
        },
      ],
    },
  ]);
  const [restaurantConfig, setRestaurantConfig] = useState({
  
  currency: {
    code: "",
    symbol: "",
    symbolPosition: "before", 
  },

  tax: {
    enabled: false,
    name: "",
    percentage: "",
    pricesIncludeTax: true,
  },

  orderModes: {
    dineIn: {
      enabled: true,
      tableNumberRequired: false,
    },
    takeaway: {
      enabled: false,
    },
  },

  foodPreferences: {
    showVegNonVeg: false,
  },
  })


  useEffect(() => {
    if(restaurantId) navigate("/");
  }, [])

  const updateConfig = (path, value) => {
  setRestaurantConfig((prev) => {
    const updated = { ...prev }
    let current = updated

    for (let i = 0; i < path.length - 1; i++) {
      current[path[i]] = { ...current[path[i]] }
      current = current[path[i]]
    }

    current[path[path.length - 1]] = value
    return updated
  })
  }


  const addCategory = () => {
    setCategories([
      ...categories,
      {
        name: "",
        items: [
          { name: "", foodType: "Veg", basePrice: "", imageFile: null, imageUrl: "", options: [] },
        ],
      },
    ]);
  };

  const addItem = (catIndex) => {
    const updated = [...categories];
    updated[catIndex].items.push({
      name: "",
      foodType: "Veg",
      basePrice: "",
      imageFile: null,
      imageUrl: "",
      options: [],
    });
    setCategories(updated);
  };

  const addOption = (catIndex, itemIndex) => {
    const updated = [...categories];
    updated[catIndex].items[itemIndex].options.push({
      name: "",
      price: "",
    });
    setCategories(updated);
  };

  const updateField = (catIndex, itemIndex, field, value) => {
    const updated = [...categories];
    updated[catIndex].items[itemIndex][field] = value;
    setCategories(updated);
  };

  const updateOption = (
    catIndex,
    itemIndex,
    optionIndex,
    field,
    value
  ) => {
    const updated = [...categories];
    updated[catIndex].items[itemIndex].options[optionIndex][
      field
    ] = value;
    setCategories(updated);
  };

  const removeOption = (catIndex, itemIndex, optionIndex) => {
    const updated = [...categories];
    updated[catIndex].items[itemIndex].options =
      updated[catIndex].items[itemIndex].options.filter(
        (_, i) => i !== optionIndex
      );
    setCategories(updated);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userId = firebaseAuth.currentUser?.uid;
      if (!userId) throw new Error("Not authenticated");

      const processedCategories = [];

      for (const category of categories) {
        const processedItems = [];

        for (const item of category.items) {
        const itemImageUrl = await uploadToCloudinary(item.imageFile);

        processedItems.push({
          name: item.name,
          foodType: item.foodType,
          basePrice: item.basePrice,
          imageUrl: itemImageUrl,
          options: item.options,
        });
      }

      processedCategories.push({
        name: category.name,
        items: processedItems,
      });
    }
      
      await saveRestaurantSetup({
        restaurantName,
        restaurantConfig,
        categories: processedCategories,
        userId,
      });

      toast.success("Setup Completed, Kindly Login again...");
      setTimeout(() => {
        logout(); 
      }, 3000);

    } catch (err) {
      console.error(err);
      setError("Setup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen">
      <div className="max-w-5xl mx-auto p-6 space-y-8">
      {error && 
        <div className="w-full max-w-sm mt-5">
          <Alert variant="destructive" className="mt-5">
            <AlertCircleIcon />
          <AlertTitle>{error}</AlertTitle>
          </Alert>
        </div>
      }
      
      <h1 className="text-2xl font-bold">
        First Time Setup
      </h1>

      <div className="space-y-2">
        <Label>Restaurant name</Label>
        <Input
          value={restaurantName}
          onChange={(e) => setRestaurantName(e.target.value)}
          placeholder="Eg. Cafe Aroma"
        />
      </div>

      <Separator />

  <div className="space-y-4 flex flex-col sm:items-center sm:flex-row sm:justify-between">
  <h3 className="text-lg font-semibold">Currency</h3>

  <Select
    value={restaurantConfig.currency.code}
    onValueChange={(value) =>
      updateConfig(["currency", "code"], value)
    }
  >
    <SelectTrigger>
      <SelectValue placeholder="Select currency" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="AED">AED</SelectItem>
      <SelectItem value="AUD">AUD</SelectItem>
      <SelectItem value="CAD">CAD</SelectItem>
      <SelectItem value="EUR">EUR</SelectItem>
      <SelectItem value="GBP">GBP</SelectItem>
      <SelectItem value="INR">INR</SelectItem>
      <SelectItem value="JPY">JPY</SelectItem>
      <SelectItem value="USD">USD</SelectItem>
    </SelectContent>
  </Select>

  <Select
    value={restaurantConfig.currency.symbol}
    onValueChange={(value) =>
      updateConfig(["currency", "symbol"], value)
    }
  >
    <SelectTrigger>
      <SelectValue placeholder="Currency Symbol" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="₹">₹</SelectItem>
      <SelectItem value="$">$</SelectItem>
      <SelectItem value="€">€</SelectItem>
      <SelectItem value="£">£</SelectItem>
      <SelectItem value="¥">¥</SelectItem>
      <SelectItem value="-">USE CODE</SelectItem>
    </SelectContent>
  </Select>

  <RadioGroup
    value={restaurantConfig.currency.symbolPosition}
    onValueChange={(value) =>
      updateConfig(["currency", "symbolPosition"], value)
    }
    className="flex gap-6"
  >
    <div className="flex items-center gap-2">
      <RadioGroupItem value="before" />
      <Label>Before amount</Label>
    </div>
    <div className="flex items-center gap-2">
      <RadioGroupItem value="after" />
      <Label>After amount</Label>
    </div>
  </RadioGroup>
</div>

<div className="space-y-4">
  <h3 className="text-lg font-semibold">Tax</h3>

  <div className="flex items-center justify-between">
    <Label>Enable Tax</Label>
    <Switch
      checked={restaurantConfig.tax.enabled}
      onCheckedChange={(checked) =>
        updateConfig(["tax", "enabled"], checked)
      }
    />
  </div>

  {restaurantConfig.tax.enabled && (
    <div className="space-y-4 pl-4 border-l">
      <Input
        placeholder="Tax Name (GST / VAT / Sales Tax)"
        value={restaurantConfig.tax.name}
        onChange={(e) =>
          updateConfig(["tax", "name"], e.target.value)
        }
      />

      <Input
        type="text"
        placeholder="Tax Percentage"
        value={restaurantConfig.tax.percentage}
        onChange={(e) =>
          updateConfig(["tax", "percentage"], e.target.value)
        }
      />

      <RadioGroup
        value={
          restaurantConfig.tax.pricesIncludeTax
            ? "inclusive"
            : "exclusive"
        }
        onValueChange={(value) =>
          updateConfig(
            ["tax", "pricesIncludeTax"],
            value === "inclusive"
          )
        }
      >
        <div className="flex items-center gap-2">
          <RadioGroupItem value="inclusive" />
          <Label>Prices include tax</Label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="exclusive" />
          <Label>Prices exclude tax</Label>
        </div>
      </RadioGroup>
    </div>
  )}
</div>
<div className="space-y-4">
  <h3 className="text-lg font-semibold">Order Modes</h3>

  <div className="flex items-center gap-2">
    <Checkbox
      checked={restaurantConfig.orderModes.dineIn.enabled}
      onCheckedChange={(checked) =>
        updateConfig(["orderModes", "dineIn", "enabled"], !!checked)
      }
    />
    <Label>Dine In</Label>
  </div>

  {restaurantConfig.orderModes.dineIn.enabled && (
    <div className="flex items-center justify-between pl-6">
      <Label>Table number required</Label>
      <Switch
        checked={
          restaurantConfig.orderModes.dineIn.tableNumberRequired
        }
        onCheckedChange={(checked) =>
          updateConfig(
            ["orderModes", "dineIn", "tableNumberRequired"],
            checked
          )
        }
      />
    </div>
  )}

  <div className="flex items-center gap-2">
    <Checkbox
      checked={restaurantConfig.orderModes.takeaway.enabled}
      onCheckedChange={(checked) =>
        updateConfig(["orderModes", "takeaway", "enabled"], !!checked)
      }
    />
    <Label>Takeaway</Label>
  </div>
</div>
  <div className="flex items-center justify-between">
    <Label>Show Veg / Non-Veg Indicator</Label>
    <Switch
      checked={restaurantConfig.foodPreferences.showVegNonVeg}
      onCheckedChange={(checked) =>
        updateConfig(
          ["foodPreferences", "showVegNonVeg"],
          checked
        )
      }
    />
  </div>
  <Separator />
      {categories.map((cat, catIndex) => (
        <Card key={catIndex}>
          <CardContent className="p-6 space-y-6">
            <h2 className="text-lg font-semibold">
              Category {catIndex + 1}
            </h2>

            <Input
              placeholder="Category name"
              value={cat.name}
              onChange={(e) => {
                const updated = [...categories];
                updated[catIndex].name = e.target.value;
                setCategories(updated);
              }}
            />

            {cat.items.map((item, itemIndex) => (
              <div
                key={itemIndex}
                className="border rounded-md p-4 space-y-4"
              >
              <div className="flex justify-between items-center">
                <h3 className="font-medium">
                  Item {itemIndex + 1}
                </h3>

              {restaurantConfig.foodPreferences.showVegNonVeg && (  
              <RadioGroup
                value={item.foodType}
                onValueChange={(value) =>
                  updateField(catIndex, itemIndex, "foodType", value)
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
            </div>

                <Input
                  placeholder="Item name"
                  value={item.name}
                  onChange={(e) =>
                    updateField(
                      catIndex,
                      itemIndex,
                      "name",
                      e.target.value
                    )
                  }
                />

                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    updateField(
                      catIndex,
                      itemIndex,
                      "imageFile",
                      e.target.files[0]
                    )
                  }
                />

                <Input
                  type="text"
                  placeholder="Base price"
                  value={item.basePrice}
                  onChange={(e) =>
                    updateField(
                      catIndex,
                      itemIndex,
                      "basePrice",
                      e.target.value
                    )
                  }
                />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Options (optional)</Label>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        addOption(catIndex, itemIndex)
                      }
                    >
                      + Add Option
                    </Button>
                  </div>

                  {item.options.map((opt, optionIndex) => (
                    <div
                      key={optionIndex}
                      className="flex gap-2 items-center"
                    >
                      <Input
                        placeholder="Option name"
                        value={opt.name}
                        onChange={(e) =>
                          updateOption(
                            catIndex,
                            itemIndex,
                            optionIndex,
                            "name",
                            e.target.value
                          )
                        }
                      />

                      <Input
                        type="text"
                        placeholder="Price +"
                        value={opt.price}
                        onChange={(e) =>
                          updateOption(
                            catIndex,
                            itemIndex,
                            optionIndex,
                            "price",
                            e.target.value
                          )
                        }
                      />

                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        onClick={() =>
                          removeOption(
                            catIndex,
                            itemIndex,
                            optionIndex
                          )
                        }
                      >
                        <X size={16} />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <Button
              variant="outline"
              size="sm"
              onClick={() => addItem(catIndex)}
            >
              + Add Item
            </Button>
          </CardContent>
        </Card>
      ))}

      <Button variant="outline" onClick={addCategory}>
        + Add Category
      </Button>

      <Separator />

      <Button size="lg" onClick={handleSave} disabled={loading}>
        {loading ? "Saving..." : "Save Menu Setup"}
      </Button>
    </div>
    </div>
  );
}
