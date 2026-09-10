import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { isAdminRequest } from "@/lib/admin-auth";

export async function PATCH(request, { params }) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();

    const updateData = {};
    if (typeof body.read === "boolean") {
      updateData.read = body.read;
    }

    await adminDb.collection("messages").doc(id).update(updateData);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Message PATCH error:", error);
    return NextResponse.json({ error: "Failed to update message" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    await adminDb.collection("messages").doc(id).delete();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Message DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete message" }, { status: 500 });
  }
}
