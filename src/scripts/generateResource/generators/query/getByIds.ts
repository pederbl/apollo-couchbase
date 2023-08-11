import { ResourceNameForms } from '../../lib/generateResourceNameForms.js';

export function generateGetByIdsCode(resourceName: ResourceNameForms) {
  const { singularCapitalized, pluralLowerCase } = resourceName;

  return `import { getCollection, handleCouchbaseError } from "apollo-couchbase";
import { ${singularCapitalized}, ErrorResponse } from "src/graphql/generated-types";

const COLLECTION_NAME = "${pluralLowerCase}";

export async function resolver(_: any, { ids }: { ids: string[] }) {
    const records: ${singularCapitalized}[] = [];
    const errors: ErrorResponse[] = [];

    const collection = await getCollection(COLLECTION_NAME);
    const results = await Promise.allSettled(ids.map(id => collection.get(id)));
    results.forEach((result, index) => {
        if (result.status === "fulfilled") {
            records.push({ id: ids[index], content: result.value.content });
        } else {
            errors.push(handleCouchbaseError(result.reason, ids[index]));
        }
    });

    return {
        records,
        errors
    };
}
`;
}
