import { getEmbeddingsTable } from "./lancedb";

export async function insertEmbedding(
    id: string,
    embedding: number[],
    metadata: { userId: string; title:string; content: string; createdAt: string}
){
    const table = await getEmbeddingsTable();
    const row = {
        id,
        userId: metadata.userId,
        title: metadata.title,
        content: metadata.content,
        createdAt: metadata.createdAt,
        vector: embedding
    }
    await table.add([row])
    // await table.optimize();
}