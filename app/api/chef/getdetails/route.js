import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectToDB } from "@/lib/db";
import Chef from "@/models/chef";

export async function GET(req) {
  try {
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, "hello");

    await connectToDB();

    const chef = await Chef.findById(decoded.id).select("-password");

    if (!chef) {
      return NextResponse.json({ error: "Chef not found" }, { status: 404 });
    }

    return NextResponse.json({ chef }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 403 }
    );
  }
}
