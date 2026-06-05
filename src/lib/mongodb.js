import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const options = {};

let client;
let clientPromise;

if (!uri) {
  // No MongoDB URI — use null so the app falls back to JSON data files
  clientPromise = null;
} else {
  if (process.env.NODE_ENV === "development") {
    // In development, use a global variable to preserve the connection across HMR
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri, options);
      global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
  } else {
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
  }
}

export default clientPromise;

/**
 * Helper: Get a database reference.
 */
export async function getDatabase(dbName = "portfolio") {
  if (!clientPromise) return null;
  const client = await clientPromise;
  return client.db(dbName);
}

/**
 * Helper: Get a collection reference.
 */
export async function getCollection(collectionName, dbName = "portfolio") {
  const db = await getDatabase(dbName);
  if (!db) return null;
  return db.collection(collectionName);
}
