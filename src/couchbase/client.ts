import { createCouchbaseCluster } from "./connection";

const COUCHBASE_BUCKET = process.env.COUCHBASE_BUCKET;
const COUCHBASE_SCOPE = process.env.COUCHBASE_SCOPE || "_default";
const COUCHBASE_ACCESS_BUCKET = process.env.COUCHBASE_ACCESS_BUCKET || COUCHBASE_BUCKET;
const COUCHBASE_ACCESS_SCOPE = process.env.COUCHBASE_ACCESS_SCOPE || COUCHBASE_SCOPE;

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
    const accessBucket = cluster.bucket(COUCHBASE_ACCESS_BUCKET);
    const accessScope = bucket.scope(COUCHBASE_ACCESS_SCOPE);
 
    return {
      cluster,
      bucket,
      scope,
      accessBucket,
      accessScope
    }
}
