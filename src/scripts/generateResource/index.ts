import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { generateResourceNameForms, ResourceNameForms } from "./lib/generateResourceNameForms";
import {
  generateCreateCode,
  generateDeleteCode,
  generatePatchCode,
  generateReplaceCode,
  generateSchemaCode
} from "./generators";

const [_, __, resourceName] = process.argv;

if (!resourceName) {
  throw new Error(`No resource name specified. ${process.argv}`);
}

if(!resourceName.endsWith("s")) {
  throw new Error("Invalid resource name. The resource name must be plural (ending with 's').");
}

const resourceNameForms: ResourceNameForms = generateResourceNameForms(resourceName);
const currentDir = dirname(fileURLToPath(import.meta.url));
const resourceDir = resolve(currentDir, `../../../src/graphql/resources/${resourceNameForms.pluralLowerCase}`);

if (existsSync(resourceDir)) {
  throw new Error(`Resource directory already exists: ${resourceDir}`);
}

(async () => {
  try {
    await mkdir(resourceDir, { recursive: true });
    await mkdir(`${resourceDir}/mutations`);
    await mkdir(`${resourceDir}/queries`);

    await writeFile(`${resourceDir}/mutations/Create.ts`, generateCreateCode(resourceNameForms));
    await writeFile(`${resourceDir}/mutations/Delete.ts`, generateDeleteCode(resourceNameForms));
    await writeFile(`${resourceDir}/mutations/Patch.ts`, generatePatchCode(resourceNameForms));
    await writeFile(`${resourceDir}/mutations/Replace.ts`, generateReplaceCode(resourceNameForms));
    await writeFile(`${resourceDir}/schema.graphql`, generateSchemaCode(resourceNameForms));

    console.log(`Resource '${resourceNameForms.pluralCapitalized}' generated successfully.`);
  } catch (error) {
    console.error(`Error generating resource: ${(error as Error).message}`);
  }
})();

