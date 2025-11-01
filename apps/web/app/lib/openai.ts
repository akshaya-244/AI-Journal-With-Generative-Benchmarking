import OpenAI from 'openai'

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,  
});

export async function generateEmbedding(text:string): Promise<number[]> {
    const response = await openai.embeddings.create({
        model: 'text-embedding-3-large',
        input: text,
    });
    const embedding = response.data[0]?.embedding;
    if(!embedding) throw new Error('Failed to generate embedding');
    return embedding;
}