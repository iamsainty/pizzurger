import { connectToMongo } from "@/lib/connectDB";
import Chef from "@/models/chef";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    const { name, email, password, speciality } = await req.json();
    await connectToMongo();

    const existingChef = await Chef.findOne({ email });

    if (existingChef) {
      return NextResponse.json(
        { message: "Email already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newChef = await Chef.create({
      name,
      email,
      password: hashedPassword,
      speciality,
    });

    const token = jwt.sign(
      { id: newChef._id, email: newChef.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return NextResponse.json(
      { message: "Chef registered successfully", token },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
