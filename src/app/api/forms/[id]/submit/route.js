import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request, { params }) {
  const { id } = await params;
  const template = await prisma.formTemplate.findUnique({
    where: { id },
  });
  if (!template)
    return NextResponse.json({ error: "Form not found" }, { status: 404 });
  if (!template.active)
    return NextResponse.json({ error: "Form is not active" }, { status: 400 });

  const body = await request.json();
  const submission = await prisma.formSubmission.create({
    data: {
      formId: id,
      data: body.data || {},
      email: body.email || body.data?.email || null,
    },
  });
  return NextResponse.json(submission, { status: 201 });
}
