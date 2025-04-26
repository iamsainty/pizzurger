import { NextResponse } from "next/server";
import Order from "@/models/order";
import { connectToMongo } from "@/lib/connectDB";

export async function GET(req, { params }) {
  try {
    const { customerId } = params;

    await connectToMongo();

    const orders = await Order.find({ customerId }).populate("chefId", "name").select("-__v");

    if (!orders) {
      return NextResponse.json({ error: "No orders found" }, { status: 404 });
    }

    return NextResponse.json({ orders }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error fetching orders" }, { status: 500 });
  }
}
