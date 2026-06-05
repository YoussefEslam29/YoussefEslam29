import { NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";
import skillsData from "@/data/skills.json";

export async function GET() {
  try {
    const collection = await getCollection("skills");
    if (collection) {
      const skills = await collection.find({}).toArray();
      if (skills.length > 0) {
        return NextResponse.json(skills);
      }
    }
    return NextResponse.json(skillsData);
  } catch (error) {
    console.error("Skills GET error:", error);
    return NextResponse.json(skillsData);
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const collection = await getCollection("skills");

    if (!collection) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }

    const skill = {
      ...body,
      id: body.id || body.name.toLowerCase().replace(/\s+/g, "-"),
      createdAt: new Date(),
    };

    await collection.insertOne(skill);
    return NextResponse.json(skill, { status: 201 });
  } catch (error) {
    console.error("Skills POST error:", error);
    return NextResponse.json({ error: "Failed to create skill" }, { status: 500 });
  }
}
