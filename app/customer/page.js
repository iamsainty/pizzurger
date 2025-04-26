"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCookie } from "cookies-next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

const Dashboard = () => {
  const [customer, setCustomer] = useState(null);
  const [orders, setOrders] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const token = getCookie("customerToken");

    if (!token) {
      router.push("/login");
      return;
    }

    const fetchCustomerDetails = async () => {
      const res = await fetch("/api/customer/getdetails", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      if (data.error) {
        // Handle errors, possibly redirect to login
        router.push("/");
      } else {
        setCustomer(data.customer);
        fetchOrders(data.customer._id);
      }
    };

    const fetchOrders = async (customerId) => {
      const res = await fetch(`/api/customer/orders/${customerId}`);
      const data = await res.json();
      if (data.orders) {
        setOrders(data.orders);
      }
    };

    fetchCustomerDetails();
  }, [router]);

  const handlePlaceOrder = () => {
    router.push("/customer/order");
  };

  return (
    <div className="flex flex-col gap-8 items-center justify-center min-h-screen p-4 bg-gray-50">
      {customer && (
        <Card className="w-full max-w-md shadow-md rounded-2xl bg-white">
          <CardTitle className="text-center">
            {customer.name}
          </CardTitle>
          <CardContent>
            <p>Email: {customer.email}</p>
            <Button onClick={handlePlaceOrder}>Place Order</Button>
            <h2 className="mt-4 text-xl">Your Orders</h2>
            <div className="mt-4">
              {orders.length > 0 ? (
                orders.map((order) => (
                  <Card key={order._id} className="mb-4">
                    <CardTitle>Order # {order.orderNumber}</CardTitle>
                    <p>Status: {order.status}</p>
                    <p>Item: {order.item}</p>
                    <p>Price: ${order.price}</p>
                  </Card>
                ))
              ) : (
                <p>No orders placed yet.</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
