import { Collection, Db, MongoClient } from "mongodb"

let database: Db
let client: MongoClient
let connection: Promise<Db>

async function getInstance(): Promise<Db> {
    // Returns the existing connection if it is already established
    if(database) {
        return database
    }

    // Gets the MongoDB connection string
    const uri = process.env.ATLAS_URI
    // And checks if it's defined in the .env file
    if(!uri) {
        throw new Error(
            "The ATLAS_URI is not defined. Check your .env file if it contains a valid MongoDB connection string."
        )
    }

    try {
        // Creates a new MongoDB client instance
        client = new MongoClient(uri, {
            appName: "negroni-nights-helper",
        })

        await client.connect()

        database = client.db("nights")
    } catch(error) {
        throw error
    }
    
    return database
}

export async function getConnection(): Promise<Db> {
    connection ??= getInstance()

    return await connection
}

export function getCollection(collectionName: string): Collection {
    if(!database) {
        throw new Error("Database is not connected.")
    }

    return database.collection(collectionName)
}