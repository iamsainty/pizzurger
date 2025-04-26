import { connectToMongo } from "@/lib/connectDB";
import Customer from "@/models/customer";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    const JWT_SECRET = "hello";
    const { name, email, password } = await req.json();
    await connectToMongo();

    const existingCustomer = await Customer.findOne({ email });

    if (existingCustomer) {
      return NextResponse.json(
        { message: "Email already exists" },
        { status: 404 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newCustomer = new Customer({
      name,
      email,
      password: hashedPassword,
    });

    await newCustomer.save();

    const token = jwt.sign(
      { id: newCustomer._id, email: newCustomer.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    return NextResponse.json(
      { message: "Customer created successfully", token },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
