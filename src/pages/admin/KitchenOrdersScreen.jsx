import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Spinner } from "@/components/ui/spinner"
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeftIcon } from "lucide-react";
import { getKitchenOrders } from "@/services/read/getKitchenOrders";
import { markOrderReady } from "@/services/update/markOrderReady";
import { markOrderCompleted } from "@/services/delete/markOrderCompleted";
import { markPaymentDone } from "@/services/update/markPaymentDone";
import { useRestaurant } from "@/context/RestaurantContext";
import { formatPriceWithSymbol } from "@/utils/priceHelper";

export default function KitchenOrdersScreen({ restaurantId }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [paymentFilter, setPaymentFilter] = useState("ALL");

  const { restaurantConfig, loadingMenu } = useRestaurant();

  useEffect(() => {
    setLoading(true);
    const unsubscribe = getKitchenOrders(restaurantId, setOrders, setLoading);

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [restaurantId]);
  
  if(loading || loadingMenu || !restaurantConfig) {
    return (
      <div className="absolute inset-0 flex justify-center items-center">
        <Spinner className="size-6" />
      </div>
    )
  }

  const bothOrderModesEnabled = restaurantConfig?.orderModes.dineIn.enabled && restaurantConfig?.orderModes.takeaway.enabled;
  const dineInAndTable = restaurantConfig?.orderModes.dineIn.enabled && restaurantConfig?.orderModes.dineIn.tableNumberRequired;

  const filteredOrders = orders.filter((order) => {

    const statusMatch = statusFilter === "ALL" || order.status === statusFilter;
    const paymentMatch = paymentFilter === "ALL" || order.paymentStatus === paymentFilter;

  return statusMatch && paymentMatch;
  });


  return (
    <div className="relative min-h-screen">
      <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <NavLink to="/">
            <Button variant="outline" size="icon" aria-label="Go Back">
                <ArrowLeftIcon />
            </Button>
        </NavLink>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All</SelectItem>
            <SelectItem value="PLACED">Placed</SelectItem>
            <SelectItem value="READY">Ready</SelectItem>
          </SelectContent>
        </Select>

        <Select value={paymentFilter} onValueChange={setPaymentFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Payment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="PAID">Paid</SelectItem>
          </SelectContent>
        </Select>

      </div>

      {filteredOrders.length === 0 ? (
        <div className="flex justify-center items-center">
            No orders found
          </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredOrders.map((order) => (
            <Card key={order.id}>
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold">
                    #{order.token} 
                  </span>
                  
                  {bothOrderModesEnabled && order.orderType !== "default" && (
                    <span className="text-sm font-semibold">{order.orderType}</span>
                  )}
                  
                  {dineInAndTable && order.tableNo !== 0 && (
                    <span className="text-sm font-semibold">
                      Table - {order.tableNo}
                    </span>
                  )}

                  <Badge
                    variant={
                      order.status === "READY"
                        ? "default"
                        : "secondary"
                    }
                  >
                    {order.status.toUpperCase()}
                  </Badge>

                </div>

                <div className="space-y-2 text-sm">
                  {order.items.map((item, idx) => (
                    <div key={idx}>
                      <div className="font-medium">
                        {item.name} x {item.qty}
                      </div>

                      {item.options?.length > 0 && (
                        <div className="text-muted-foreground text-xs ml-2">
                          {item.options
                            .map(
                              (o) =>
                                `${o.name}`
                            )
                            .join(", ")}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>{formatPriceWithSymbol(order.totalAmount, restaurantConfig)}</span>
                </div>

                {order.paymentStatus === "PENDING" && (
                  <Button variant="outline" className="w-full" onClick={() => markPaymentDone(order.id)}>
                    Collect Payment
                  </Button>
                )}

                {order.status === "PLACED" && (
                  <Button className="w-full" onClick={() => markOrderReady(order.id)}>
                    Mark Ready
                  </Button>
                )}

                {order.status === "READY" && (
                  <Button
                    variant="outline"
                    className="w-full"
                    disabled={order.paymentStatus === "PENDING"}
                    onClick={() => markOrderCompleted(order.id)}
                  >
                    Complete Order
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
      </div>
  );
}
