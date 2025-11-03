import { PrismaClient } from "@/app/generated/prisma";
import { auth } from "@/app/lib/auth";
import { generateEmbedding } from "@/app/lib/openai";
import { insertEmbedding } from "@/app/lib/vectorize";
import { success } from "better-auth";
import { error } from "console";
import { NextRequest, NextResponse } from "next/server";
import { title } from "process";

const prisma = new PrismaClient();
export const runtime = 'nodejs'
export async function POST(req:NextRequest) {
    try{
        //get auth user
        const session = await auth.api.getSession({headers: req.headers});
        if(!session?.user) {
            return NextResponse.json({error: "Unauthorised"}, {status : 401});
        }
        const { title, content } = await req.json();
        if(!content?.trim()){
            return NextResponse.json({error: 'Content is required'}, {status: 400})
        }
        if(!title?.trim()){
            return NextResponse.json({error: 'Title is required'}, {status: 400})
        }

        //create journal entry in Postgre sQL
        //TODO: CREATE S3 for JOURNAL ENTRY
        const entry = await prisma.journalEntry.create({
            data: {
                userId: session.user.id,
                title: title.trim(),
                content: content.trim(),
            }
        });
         
        //Generate Embedding async
        try {
            const embedding = await generateEmbedding(content.trim());
            const res = await insertEmbedding(
                entry.id,
                embedding,
                {
                    userId: session.user.id,
                    title: title.trim(),
                    content: content.trim(),
                    createdAt: entry.createdAt.toISOString(),
                },
                // session.user.id
            );
            await prisma.journalEntry.update({
                where: { id: entry.id },
                data: { vectorId: entry.id },
            });
        } catch (err) {
            console.error("Background embedding error", err);
        }

            return NextResponse.json({
                success: true,
                entry: {
                    id: entry.id,
                    content: entry.content,
                    createdAt: entry.createdAt,
                }
            })
    }
    catch(error){
        console.error('Journal POST error: ', error)
        return NextResponse.json(
            {error: "Internal server error"},
            {status: 500}
        )
    }
}

export async function GET(req:NextRequest) {
    try{
        const session = await auth.api.getSession({ headers: req.headers})
        if(!session?.user){
            return NextResponse.json({ error: "Unauthorised"}, {status: 401})
        }

        const entries = await prisma.journalEntry.findMany({
            where: { userId: session.user.id},
            orderBy: {createdAt: 'desc'},
            select: {
                id: true,
                title: true,
                content: true,
                createdAt: true,
                updatedAt: true
            }
        });

        return NextResponse.json({entries})

            
    }
    catch(error){
        console.error('Journal GET error', error)
        return NextResponse.json(
            {error: 'Internal server error'},
            {status: 500}
        )
    }
}