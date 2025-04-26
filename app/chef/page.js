"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCookie } from "cookies-next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

const ChefDashboard = () => {
  const [chef, setChef] = useState(null);
  const [orders, setOrders] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const token = getCookie("token");

    if (!token) {
      router.push("/login");
      return;
    }

    const fetchChefDetails = async () => {
      const res = await fetch("/api/chef/getdetails", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      if (data.error) {
        router.push("/");
      } else {
        setChef(data.chef);
        fetchOrders(data.chef.speciality);
      }
    };

    const fetchOrders = async (speciality) => {
      const res = await fetch(`/api/chef/orders/${speciality}`);
      const data = await res.json();
      if (data.orders) {
        setOrders(data.orders);
      }
    };

    fetchChefDetails();
  }, [router]);

  const handleChangeStatus = async (orderId) => {
    const token = getCookie("token");

    const res = await fetch(`/api/chef/update-status/${orderId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (data.success) {
      // Update the order status in the UI
      setOrders(orders.map((order) =>
        order._id === orderId ? { ...order, status: "completed" } : order
      ));
    }
  };

  return (
    <div className="flex flex-col gap-8 items-center justify-center min-h-screen p-4 bg-gray-50">
      {chef && (
        <Card className="w-full max-w-md shadow-md rounded-2xl bg-white">
          <CardTitle className="text-center">{chef.name}</CardTitle>
          <CardContent>
            <p>Email: {chef.email}</p>
            <h2 className="mt-4 text-xl">Orders for {chef.speciality}</h2>
            <div className="mt-4">
              {orders.length > 0 ? (
                orders.map((order) => (
                  <Card key={order._id} className="mb-4">
                    <CardTitle>Order # {order.orderNumber}</CardTitle>
                    <p>Status: {order.status}</p>
                    <p>Item: {order.item}</p>
                    <p>Customer: {order.customerId.name}</p>
                    <Button
                      onClick={() => handleChangeStatus(order._id)}
                      disabled={order.status === "completed"}
                    >
                      Mark as Completed
                    </Button>
                  </Card>
                ))
              ) : (
                <p>No orders for your speciality.</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ChefDashboard;
