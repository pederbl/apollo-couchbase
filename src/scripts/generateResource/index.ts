#!/usr/bin/env node -r dotenv/config

import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import { resolve } from "path";
import { getCouchbaseClient } from "../../couchbase/client.js"; 
import {
  generateCreateCode,
  generateDeleteCode,
  generatePatchCode,
  generateReplaceCode,
  generateGetByIdsCode, 
  generateListCode,
  generateSchemaCode
} from "./generators/index.js";
import { generateResourceNameForms, ResourceNameForms } from "./lib/generateResourceNameForms.js";
import { CollectionManager, CollectionQueryIndexManager } from "couchbase";
import { retryAsync } from "ts-retry";


const [_, __, resourceName] = process.argv;

if (!resourceName) {
  throw new Error(`No resource name specified. ${process.argv}`);
}

if(!resourceName.endsWith("s")) {
  throw new Error("Invalid resource name. The resource name must be plural (ending with 's').");
}

const resourceNameForms: ResourceNameForms = generateResourceNameForms(resourceName);
const resourceDir = resolve(process.cwd(), `src/graphql/resources/${resourceNameForms.pluralLowerCase}`);

if (existsSync(resourceDir)) {
  throw new Error(`Resource directory already exists: ${resourceDir}`);
}

async function createCollection(collectionName: string) {
  const { defaultBucket, defaultScope } = await getCouchbaseClient();
  const collectionManager: CollectionManager = defaultBucket.collections(); 
  await collectionManager.createCollection({ name: collectionName, scopeName: defaultScope.name });
  console.log("Collection created:", collectionName);
}
async function createPrimaryIndex(collectionName: string) {
  const { defaultScope } = await getCouchbaseClient();
  const collection = defaultScope.collection(collectionName); 
  const indexManager: CollectionQueryIndexManager = collection.queryIndexes();
  await retryAsync(
      async () => {
          await indexManager.createPrimaryIndex(); 
          console.log("Primary index created.");
      },
      { delay: 100, maxTry: 30 }
  );
}

(async () => {
  try {
    await createCollection(resourceNameForms.pluralLowerCase);
  } catch (error) {
      console.error(`Error generating collection: ${(error as Error).message}`);
  }
  try {
    await createPrimaryIndex(resourceNameForms.pluralLowerCase);
  } catch (error) {
      console.error(`Error generating primary index: ${(error as Error).message}`);
  }

  try {
    await mkdir(resourceDir, { recursive: true });
    await mkdir(`${resourceDir}/mutation`);
    await mkdir(`${resourceDir}/query`);

    await writeFile(`${resourceDir}/mutation/create.ts`, generateCreateCode(resourceNameForms));
    await writeFile(`${resourceDir}/mutation/delete.ts`, generateDeleteCode(resourceNameForms));
    await writeFile(`${resourceDir}/mutation/patch.ts`, generatePatchCode(resourceNameForms));
    await writeFile(`${resourceDir}/mutation/replace.ts`, generateReplaceCode(resourceNameForms));    
    await writeFile(`${resourceDir}/query/list.ts`, generateListCode(resourceNameForms));
    await writeFile(`${resourceDir}/query/getByIds.ts`, generateGetByIdsCode(resourceNameForms));
    await writeFile(`${resourceDir}/schema.graphql`, generateSchemaCode(resourceNameForms));

    console.log(`Resource '${resourceNameForms.pluralCapitalized}' generated successfully.`);
  } catch (error) {
    console.error(`Error generating resource: ${(error as Error).message}`);
  }
})();

