#!/usr/bin/env node

import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import { resolve } from "path";
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

(async () => {
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

