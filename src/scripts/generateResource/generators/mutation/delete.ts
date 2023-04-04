import { ResourceNameForms } from '../../lib/generateResourceNameForms';

export function generateDeleteCode(resourceName: ResourceNameForms) {
  const { singularCapitalized, pluralLowerCase } = resourceName;

  return `import { getCollection, handleCouchbaseError } from "apollo-couch";
import { ${singularCapitalized}sDeleteResponse } from "../../../generated-types";

const COLLECTION_NAME = "${pluralLowerCase}";
const collection = await getCollection(COLLECTION_NAME);

async function delete${singularCapitalized}(id: string): Promise<string> {
  await collection.remove(id);
  return id;
}

export async function resolver(_: any, { ids }: { ids: string[] }): Promise<${singularCapitalized}sDeleteResponse> {
  const results = await Promise.allSettled(ids.map(delete${singularCapitalized}));
  const response = results.reduce<${singularCapitalized}sDeleteResponse>((acc, result) => {
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
