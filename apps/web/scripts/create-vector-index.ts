import { getEmbeddingsTable } from "@/app/lib/lancedb";
import * as lancedb from "@lancedb/lancedb";
export async function createVectorIndex() {
    const table = await getEmbeddingsTable()
    try{
        await table.createIndex({
            metric: "cosine", 
            config: lancedb.Index.hnswSq({
              numPartitions: 1024,
          
            }),
          });
          
    }
    catch(e){
        console.log(e)
    }
}