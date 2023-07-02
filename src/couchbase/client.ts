import { Cluster, Bucket, Scope } from "couchbase";
import { createCouchbaseCluster } from "./connection.js";

const COUCHBASE_DEFAULT_BUCKET = process.env.COUCHBASE_DEFAULT_BUCKET || "_default";
const COUCHBASE_DEFAULT_SCOPE = process.env.COUCHBASE_DEFAULT_SCOPE || "_default";
const COUCHBASE_ACCESS_BUCKET = process.env.COUCHBASE_ACCESS_BUCKET || COUCHBASE_DEFAULT_BUCKET;
const COUCHBASE_ACCESS_SCOPE = process.env.COUCHBASE_ACCESS_SCOPE || COUCHBASE_DEFAULT_SCOPE;

export async function getCollection(collectionName: string, scopeName?: string, bucketName?: string) {
  const cluster = await createCouchbaseCluster();
  const bucket = cluster.bucket(bucketName || COUCHBASE_DEFAULT_BUCKET);
  const scope = bucket.scope(scopeName || COUCHBASE_DEFAULT_SCOPE);
  return scope.collection(collectionName); 
}

export interface CouchbaseClient {
  cluster: Cluster,
  defaultBucket: Bucket,
  defaultScope: Scope,
  accessScope: Scope
}

export async function getCouchbaseClient(): Promise<CouchbaseClient> {
    const cluster = await createCouchbaseCluster()
    const defaultBucket = cluster.bucket(COUCHBASE_DEFAULT_BUCKET);
    const defaultScope = defaultBucket.scope(COUCHBASE_DEFAULT_SCOPE);
    const accessBucket = cluster.bucket(COUCHBASE_ACCESS_BUCKET);
    const accessScope = accessBucket.scope(COUCHBASE_ACCESS_SCOPE);
 
    return {
      cluster,
      defaultBucket,
      defaultScope,
      accessScope
    }
}
