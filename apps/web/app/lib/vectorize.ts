import { getEmbeddingsTable } from "./lancedb";

export async function insertEmbedding(
    id: string,
    embedding: number[],
    metadata: { userId: string; content: string; createdAt: string}
){
    const table = await getEmbeddingsTable();
    const row = {
        id,
        userId: metadata.userId,
        content: metadata.content,
        createdAt: metadata.createdAt,
        vector: embedding
    }
    await table.add([row])
    // await table.optimize();
}