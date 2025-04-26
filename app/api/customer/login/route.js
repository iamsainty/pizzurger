import { connectToMongo } from "@/lib/connectDB";
import Customer from "@/models/customer";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    const JWT_SECRET = "hello";
    const { email, password } = await req.json();
    await connectToMongo();

    const customer = await Customer.findOne({ email });

    if (!customer) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, customer.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      { id: customer._id, email: customer.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    return NextResponse.json(
      { message: "Login successful", token },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
