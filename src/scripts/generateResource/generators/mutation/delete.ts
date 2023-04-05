import { ResourceNameForms } from '../../lib/generateResourceNameForms';

export function generateDeleteCode(resourceName: ResourceNameForms) {
  const { singularCapitalized, pluralCapitalized, pluralLowerCase } = resourceName;

  return `import { getCollection, handleCouchbaseError } from "apollo-couch";
import { ${pluralCapitalized}DeleteResponse } from "../../../generated-types";

const COLLECTION_NAME = "${pluralLowerCase}";
const collection = await getCollection(COLLECTION_NAME);

async function delete${singularCapitalized}(id: string): Promise<string> {
  await collection.remove(id);
  return id;
}

export async function resolver(_: any, { ids }: { ids: string[] }): Promise<${pluralCapitalized}DeleteResponse> {
  const results = await Promise.allSettled(ids.map(delete${singularCapitalized}));
  const response = results.reduce<${pluralCapitalized}DeleteResponse>((acc, result) => {
      if (result.status === "fulfilled") {
        acc.deletedIds.push(result.value);
      } else {
        acc.errors.push(handleCouchbaseError(result.reason));
      }
      return acc;
    }, {
      deletedIds: [],
      errors: []
    }
  );

  return response;
}
`;
}
