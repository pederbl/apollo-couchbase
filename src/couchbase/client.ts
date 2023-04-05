import { createCouchbaseCluster } from "./connection";

const COUCHBASE_BUCKET = process.env.COUCHBASE_BUCKET;
const COUCHBASE_SCOPE = process.env.COUCHBASE_SCOPE || "_default";

export async function getCollection(collectionName: string) {
  const cluster = await createCouchbaseCluster();
  const bucket = cluster.bucket(COUCHBASE_BUCKET);
  const scope = bucket.scope(COUCHBASE_SCOPE);
  return scope.collection(collectionName); 
}

export async function getCouchbaseClient() {
    const cluster = await createCouchbaseCluster()
    const bucket = cluster.bucket(COUCHBASE_BUCKET);
    const scope = bucket.scope(COUCHBASE_SCOPE);
  
    return {
      cluster,
      bucket,
      scope
    }
}
