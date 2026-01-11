import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { getReadyOrders } from "@/services/read/getReadyOrders";

export default function TokenQueue({ restaurantId }) {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const unsubscribe = getReadyOrders(restaurantId, setOrders);

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [restaurantId]);

  return (
    <div className="p-6">
      {orders.length === 0 ? (
          <div className="flex justify-center items-center">
            No orders ready yet
          </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {orders.map((order) => (
            <Card
              key={order.id}
              className="flex items-center justify-center h-28"
            >
              <CardContent className="flex flex-col items-center justify-center gap-2 p-4">
                <span className="text-4xl font-extrabold">
                  {order.token}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 
