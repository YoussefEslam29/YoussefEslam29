import { NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";
import credentialsData from "@/data/credentials.json";
import { isAdminRequest } from "@/lib/admin-auth";

export async function GET() {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const collection = await getCollection("certificates");
    if (collection) {
      const certs = await collection.find({}).sort({ createdAt: -1 }).toArray();
      if (certs.length > 0) {
        return NextResponse.json(certs);
      }
    }
    return NextResponse.json(credentialsData.certificates);
  } catch (error) {
    console.error("Certificates GET error:", error);
    return NextResponse.json(credentialsData.certificates);
  }
}

export async function POST(request) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const collection = await getCollection("certificates");

    if (!collection) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }

    const cert = {
      id: body.id || body.title.toLowerCase().replace(/\s+/g, "-"),
      title: body.title,
      issuer: body.issuer,
      date: body.date || "",
      description: body.description || "",
      category: body.category || "IEEE & Events",
      image: body.image || "",
      createdAt: new Date(),
    };

    await collection.insertOne(cert);
    return NextResponse.json(cert, { status: 201 });
  } catch (error) {
    console.error("Certificates POST error:", error);
    return NextResponse.json({ error: "Failed to create certificate" }, { status: 500 });
  }
}
