import { PrismaClient } from "@/app/generated/prisma";
import { auth } from "@/app/lib/auth";
import { getEmbeddingsTable } from "@/app/lib/lancedb";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();
export const runtime = "nodejs";
export const dynamic = 'force-dynamic';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { content } = await req.json();
    if (!content?.trim()) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    const entry = await prisma.journalEntry.update({
      where: { id:params.id, userId: session.user.id },
      data: { content: content.trim() },
    });

    return NextResponse.json({
      success: true,
      entry: {
        id: entry.id,
        content: entry.content,
        createdAt: entry.createdAt,
        updatedAt: entry.updatedAt,
      },
    });
  } catch (error) {
    console.error("Journal PATCH error", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
  ) {
    try {
      const session = await auth.api.getSession({ headers: req.headers });
      if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
  
      try{
        const table = await getEmbeddingsTable()
        // const del = `id = ${params.id}`
        await table.delete(`id = '${params.id}'`)
      }
      catch (lancedbError){
        console.log("Lancedb deletion error  (non-fatal):", lancedbError);
      }
  
      const entry = await prisma.journalEntry.delete({
        where: { id: params.id, userId: session.user.id },
       
      });

      return NextResponse.json({
        success: true,
        entry: {
          id: entry.id,
        
        },
      });
    } catch (error) {
      console.error("Journal DELETE error", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  }