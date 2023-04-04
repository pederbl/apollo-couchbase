import { createCouchbaseCluster } from "./connection";

export async function getCollection(collectionName: string) {
  const cluster = await createCouchbaseCluster();
  const bucket = cluster.bucket("main");
  const scope = bucket.scope("play");
  return scope.collection(collectionName); 
}

export async function getCouchbaseClient() {
    const cluster = await createCouchbaseCluster()
    const bucket = cluster.bucket("main");
    const scope = bucket.scope("play");
  
    return {
      cluster,
      bucket,
      scope
    }
}
