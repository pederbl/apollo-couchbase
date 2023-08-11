import { ResourceNameForms } from '../../lib/generateResourceNameForms.js';

export function generatePatchCode(resourceName: ResourceNameForms) {
  const { singularLowerCase, singularCapitalized, pluralCapitalized, pluralLowerCase } = resourceName;

  return `import { getCollection, handleCouchbaseError } from "apollo-couchbase";
import { MutateInSpec } from "couchbase";
import { ${singularCapitalized}, ${singularCapitalized}PatchInput, ${pluralCapitalized}Response } from "../../../generated-types";

const COLLECTION_NAME = "${pluralLowerCase}";

async function patch${singularCapitalized}(record: ${singularCapitalized}PatchInput): Promise<${singularCapitalized}> {
  const collection = await getCollection(COLLECTION_NAME);
  const specs = Object.entries(record.content).map(([field, value]) => {
    return MutateInSpec.replace(field, value);
  });
  await collection.mutateIn(record.id, specs);
  const ${singularLowerCase} = await collection.get(record.id);
  return { id: record.id, content: ${singularLowerCase}.content };
}

export async function resolver(_: any, { records }: { records: ${singularCapitalized}PatchInput[] }): Promise<${pluralCapitalized}Response> {
  const results = await Promise.allSettled(records.map(patch${singularCapitalized}));
  const response = results.reduce<${pluralCapitalized}Response>((acc, result) => {
      if (result.status === "fulfilled") {
        acc.records.push(result.value);
      } else {
        acc.errors.push(handleCouchbaseError(result.reason));
      }
      return acc;
    }, {
      records: [],
      errors: []
    }
  );

  return response;
}
`;
}
