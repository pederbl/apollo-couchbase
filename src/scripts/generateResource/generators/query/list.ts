import { ResourceNameForms } from '../../lib/generateResourceNameForms.js';

export function generateListCode(resourceName: ResourceNameForms) {
  const { pluralCapitalized, pluralLowerCase } = resourceName;

  return `import { getCouchbaseClient } from "apollo-couchbase";
import { ${pluralCapitalized}ListInput, ${pluralCapitalized}ListResponse } from "../../../generated-types";

export async function resolver(_: any, { query }: { query: ${pluralCapitalized}ListInput }) : Promise<${pluralCapitalized}ListResponse> {
    const { cluster } = await getCouchbaseClient();
    let queryString = \`SELECT META().id, * FROM \${process.env.COUCHBASE_DEFAULT_BUCKET}.\${process.env.COUCHBASE_DEFAULT_SCOPE}.${pluralLowerCase}\`;
    const response = await cluster.query(queryString);
    const records = response.rows.map((row: any) => { return { id: row.id, content: row.${pluralLowerCase} } });

    return {
        code: 200,
        message: "Success", 
        records: records
    }
}
`;
}
