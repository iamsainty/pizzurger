import { connectToMongo } from "@/lib/connectDB";
import Chef from "@/models/chef";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
    try {
        const JWT_SECRET = 'hello';
        const { email, password } = await req.json();
        await connectToMongo();

        const chef = await Chef.findOne({ email });

        if (!chef) {
            return NextResponse.json({ message: "Invalid email or password" }, { status: 400 });
        }

        const isPasswordCorrect = await bcrypt.compare(password, chef.password);

        if (!isPasswordCorrect) {
            return NextResponse.json({ message: "Invalid email or password" }, { status: 400 });
        }

        const token = jwt.sign(
            { id: chef._id, email: chef.email },
            JWT_SECRET,
            { expiresIn: "1h" }
        );

        return NextResponse.json({ message: "Login successful", token }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
