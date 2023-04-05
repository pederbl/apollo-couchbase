import { ResourceNameForms } from '../../lib/generateResourceNameForms';

export function generateReplaceCode(resourceName: ResourceNameForms) {
  const { singularCapitalized, pluralCapitalized, pluralLowerCase } = resourceName;

  return `import { getCollection, handleCouchbaseError } from "apollo-couch";
import { MutateInSpec } from "couchbase";
import { ${singularCapitalized}, ${singularCapitalized}ReplaceInput, ${pluralCapitalized}Response } from "../../../generated-types";

const COLLECTION_NAME = "${pluralLowerCase}";
const collection = await getCollection(COLLECTION_NAME);

async function replace${singularCapitalized}(record: ${singularCapitalized}ReplaceInput): Promise<${singularCapitalized}> {
  const specs = Object.entries(record.content).map(([field, value]) => {
    return MutateInSpec.upsert(field, value);
  });
  await collection.mutateIn(record.id, specs);
  return record;
}

export async function resolver(_: any, { records }: { records: ${singularCapitalized}ReplaceInput[] }): Promise<${pluralCapitalized}Response> {
  const results = await Promise.allSettled(records.map(replace${singularCapitalized}));
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
