import { NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";
import credentialsData from "@/data/credentials.json";

export async function GET() {
  try {
    const collection = await getCollection("certificates");
    if (collection) {
      const certs = await collection.find({}).toArray();
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
  try {
    const body = await request.json();
    const collection = await getCollection("certificates");

    if (!collection) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }

    const cert = {
      ...body,
      id: body.id || body.title.toLowerCase().replace(/\s+/g, "-"),
      createdAt: new Date(),
    };

    await collection.insertOne(cert);
    return NextResponse.json(cert, { status: 201 });
  } catch (error) {
    console.error("Certificates POST error:", error);
    return NextResponse.json({ error: "Failed to create certificate" }, { status: 500 });
  }
}
