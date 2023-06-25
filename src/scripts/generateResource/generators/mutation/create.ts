import { ResourceNameForms } from '../../lib/generateResourceNameForms';

export function generateCreateCode(resourceName: ResourceNameForms) {
  const { singularCapitalized, pluralCapitalized, pluralLowerCase } = resourceName;

  return `import { generateId, getCollection, handleCouchbaseError } from "apollo-couch";
import { ${singularCapitalized}, ${singularCapitalized}ContentInput, ${pluralCapitalized}Response } from "../../../generated-types";

const COLLECTION_NAME = "${pluralLowerCase}";

async function create${singularCapitalized}(content: ${singularCapitalized}ContentInput): Promise<${singularCapitalized}> {
  const collection = await getCollection(COLLECTION_NAME); 
  const id = generateId(COLLECTION_NAME);
  await collection.insert(id, content);
  return { id, content }
}

export async function resolver(_: any, { contents }: { contents: ${singularCapitalized}ContentInput[] }): Promise<${pluralCapitalized}Response> {
  const results = await Promise.allSettled(contents.map(create${singularCapitalized}));
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
