import * as lancedb from "@lancedb/lancedb"
import { Field, Schema, Utf8 , FixedSizeList, Float64} from "apache-arrow";
import { table } from "console";

const TABLE_NAME = "journal_embeddings";

let dbSingleton : any |null=null;
export async function getDb() {
    if(dbSingleton) return dbSingleton;

    dbSingleton = await lancedb.connect({
        uri: process.env.LANCEDB_URI!,
        apiKey: process.env.LANCEDB_API_KEY!,
        region: "us-east-1",
    });
    return dbSingleton; 
}
export async function getEmbeddingsTable() {
    const db= await getDb();
    try{
        return await db.openTable(TABLE_NAME);
    }
    catch(e){

        const dim = process.env.EMBED_DIM ? parseInt(process.env.EMBED_DIM): 3072;
        const schema = new Schema([
            new Field("id", new Utf8(), false),
            new Field("userId", new Utf8()),
            new Field("content", new Utf8()),
            new Field("createdAt", new Utf8()),
            new Field("vector", new FixedSizeList(dim, new Field("item", new Float64()))),
        ])
        //use createEmptyTable with the schema
        const table= await db.createEmptyTable(TABLE_NAME, schema, {
            primaryKey:  "id",
        });

        table.createScalarIndex("userId");
        return table;

        
        
    }
}