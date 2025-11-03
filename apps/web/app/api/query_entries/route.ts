import { auth } from "@/app/lib/auth";
import { getEmbeddingsTable } from "@/app/lib/lancedb";
import { generateEmbedding } from "@/app/lib/openai";
import { readonlyType } from "better-auth/react";
import { error } from "console";
import { NextRequest, NextResponse } from "next/server";

export async function  POST(req:NextRequest) {
    try{
        const session  = await auth.api.getSession({headers: req.headers});

        if(!session?.user) {
            return NextResponse.json({error: "Unauthorised"}, {status: 401});
        }
        
        const payload = await req.json()
        const query = typeof payload?.query === "string" ? payload.query.trim():"";

        if(!query.trim()){
            return NextResponse.json(
                {error: "Content is required"},
                {status: 400}
            )
        }
        // console.log("User Id:",session.user.id.trim())
        // console.log("USer Id: agU7ergGGJUa8cAuZvD2b9NFj09Phvm4")

        const queryVector = await generateEmbedding(query.trim());

        const table = await getEmbeddingsTable();
        // const schema = await table.schema();

        const userId = session.user.id


        // console.log(userId);
        // console.log(table.display()); 
        // console.log(schema)

        const results = await table
        .search(queryVector)
        // .where(`"userId" = '${userId}'`) // 👈 double-quote the column name
        .limit(3)
        .toArray();

        // console.log(results)

        const formattedResults = results.map((result: any) =>({
            id: result.id,
            title: result.title,
            content: result.content,
            createdAt: result.createdAt,
            score: result._distance

        }))

        return NextResponse.json({
            query,
            formattedResults,
        })
    }
    catch(e){
        console.error("Search error", e);
        return NextResponse.json(
            {error: "Failed to perform search"},
            {status: 500}
        )
    }
}