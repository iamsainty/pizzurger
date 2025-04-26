import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import Order from "@/models/order";
import Customer from "@/models/customer";
import { v4 as uuidv4 } from "uuid";

export async function POST(req) {
  try {
    const { item, quantity, orderDescription, toppings } = await req.json();
    const token = req.headers.get("authorization").split(" ")[1];

    const decoded = jwt.verify(token, "hello");

    await connectToDB();

    const customer = await Customer.findById(decoded.id);

    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    const orderNumber = uuidv4();
    const price = calculatePrice(item, quantity); // You can create your price calculation logic here

    const newOrder = new Order({
      orderNumber,
      customerId: customer._id,
      item,
      quantity,
      orderDescription,
      toppings,
      price,
      status: "pending",
    });

    await newOrder.save();

    customer.orders.push({ orderId: newOrder._id });
    await customer.save();

    return NextResponse.json({ order: newOrder }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Error placing order" }, { status: 500 });
  }
}

function calculatePrice(item, quantity) {
  const prices = {
    "veg-pizza": 10,
    "non-veg-pizza": 12,
    burger: 5,
  };
  return prices[item] * quantity;
}
