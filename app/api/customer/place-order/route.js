import { NextResponse } from "next/server";
import Order from "@/models/order";
import Customer from "@/models/customer";
import { connectToMongo } from "@/lib/connectDB";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

export async function POST(req) {
  try {
    const { item, quantity, orderDescription, toppings } = await req.json();

    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, "hello");

    await connectToMongo();

    const customer = await Customer.findById(decoded.id);
    if (!customer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    // Set Product Code and Description based on item
    let productCode = "";
    let productDescription = "";

    switch (item) {
      case "veg-pizza":
        productCode = "VPZ001";
        productDescription =
          "Delicious Veggie Pizza loaded with fresh vegetables.";
        break;
      case "non-veg-pizza":
        productCode = "NVP001";
        productDescription =
          "Tasty Non-Veg Pizza topped with chicken and sausages.";
        break;
      case "burger":
        productCode = "BRG001";
        productDescription =
          "Juicy and crispy Burger with fresh lettuce and sauce.";
        break;
      default:
        return NextResponse.json(
          { error: "Invalid item selected" },
          { status: 400 }
        );
    }

    const orderNumber = uuidv4();

    // Calculate price on server-side
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

    const toppingsPrice = toppings.reduce(
      (total, topping) => total + (toppingPrices[topping] || 0),
      0
    );

    const price = (itemPrices[item] || 0) * quantity + toppingsPrice;

    const newOrder = new Order({
      orderNumber,
      customerId: customer._id,
      item,
      quantity,
      orderDescription,
      toppings, // directly saving array of strings
      price,
      productCode,
      productDescription,
      status: "pending",
    });

    await newOrder.save();

    customer.orders.push({ orderId: newOrder._id });
    await customer.save();

    return NextResponse.json({ order: newOrder }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error placing order" }, { status: 500 });
  }
}
