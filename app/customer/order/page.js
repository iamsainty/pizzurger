"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getCookie } from "cookies-next";

const PlaceOrder = () => {
  const [item, setItem] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [toppings, setToppings] = useState([]);
  const [orderDescription, setOrderDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [availableToppings, setAvailableToppings] = useState([]);
  const router = useRouter();

  const itemPrices = {
    "veg-pizza": 10,
    "non-veg-pizza": 15,
    burger: 5,
  };

  const toppingPrices = {
    cheese: 1,
    mushroom: 1.5,
    olives: 1,
    onions: 0.5,
    peppers: 1,
    tomatoes: 1,
    chicken: 2,
    sausage: 2,
  };

  useEffect(() => {
    if (item) {
      setPrice(itemPrices[item] * quantity); // Set the price based on selected item and quantity
    }
  }, [item, quantity]);

  const handlePlaceOrder = async () => {
    const token = getCookie("token");

    if (!token) {
      router.push("/");
      return;
    }

    const orderData = {
      item,
      quantity,
      orderDescription,
      toppings,
      price,
    };

    const res = await fetch("/api/customer/place-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(orderData),
    });

    const data = await res.json();

    if (data.error) {
      console.log(data.error); // Handle error appropriately
    } else {
      router.push("/customer"); // Redirect to the customer's dashboard
    }
  };

  const handleToppingChange = (topping) => {
    setToppings(
      (prevToppings) =>
        prevToppings.includes(topping)
          ? prevToppings.filter((t) => t !== topping) // Remove topping if already selected
          : [...prevToppings, topping] // Add topping if not already selected
    );
  };

  useEffect(() => {
    if (item) {
      const availableToppings = Object.keys(toppingPrices).filter((topping) =>
        item === "veg-pizza" || item === "non-veg-pizza"
          ? true
          : topping !== "chicken" && topping !== "sausage"
      );
      setAvailableToppings(availableToppings); // Filter available toppings based on the item
    }
  }, [item]);

  useEffect(() => {
    const toppingsPrice = toppings.reduce(
      (acc, topping) => acc + toppingPrices[topping],
      0
    );
    setPrice((itemPrices[item] || 0) * quantity + toppingsPrice);
  }, [toppings, item, quantity]);

  return (
    <div className="flex flex-col gap-6 items-center justify-center min-h-screen p-6">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-6">
        Place Your Order
      </h1>

      <div className="w-full max-w-lg shadow-lg rounded-2xl bg-white p-6 space-y-6">
        <div className="mb-4">
          <Select value={item} onValueChange={setItem}>
            <SelectTrigger className="w-full p-3 border rounded-lg shadow-sm">
              <SelectValue placeholder="Select Item" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="veg-pizza">Veg Pizza</SelectItem>
              <SelectItem value="non-veg-pizza">Non-Veg Pizza</SelectItem>
              <SelectItem value="burger">Burger</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="mb-4">
          <Input
            type="number"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-full p-3 border rounded-lg shadow-sm"
          />
        </div>

        <div className="mb-4">
          <Input
            type="text"
            placeholder="Order Description"
            value={orderDescription}
            onChange={(e) => setOrderDescription(e.target.value)}
            className="w-full p-3 border rounded-lg shadow-sm"
          />
        </div>

        <div className="mb-4">
          <h3 className="font-semibold text-lg text-gray-700">
            Select Toppings:
          </h3>
          <div className="flex gap-4 flex-wrap">
            {availableToppings.map((topping) => (
              <label key={topping} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value={topping}
                  checked={toppings.includes(topping)}
                  onChange={() => handleToppingChange(topping)}
                  className="w-5 h-5"
                />
                <span className="text-gray-700">{topping}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-700">
            Total Price: <span className="font-bold">${price}</span>
          </h3>
        </div>

        <Button
          onClick={handlePlaceOrder}
          className="w-full py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Place Order
        </Button>
      </div>
    </div>
  );
};

export default PlaceOrder;
