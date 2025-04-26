import { NextResponse } from "next/server";
import Order from "@/models/order";
import { connectToMongo } from "@/lib/connectDB";

export async function PUT(req, { params }) {
  try {
    const { orderId } = params;
    const token = req.headers.get("authorization").split(" ")[1];

    const decoded = jwt.verify(token, "hello");

    await connectToMongo();

    const order = await Order.findById(orderId);

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.status !== "pending") {
      return NextResponse.json({ error: "Order is already completed or canceled" }, { status: 400 });
    }

    order.status = "completed";
    await order.save();

    return NextResponse.json({ success: true, order }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error updating order status" }, { status: 500 });
  }
}
