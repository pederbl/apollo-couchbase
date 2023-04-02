import { ResourceNameForms } from '../../lib/generateResourceNameForms';

export function generateListCode(resourceName: ResourceNameForms) {
  const { singularCapitalized, pluralLowerCase } = resourceName;

  return `import { getCouchbaseClient } from "apollo-couch";
import { ${singularCapitalized}ListInput, ${singularCapitalized}ListResponse } from "../../../generated-types";

export default async function resolver(_: any, { query }: { query: ${singularCapitalized}ListInput }) : Promise<${singularCapitalized}ListResponse> {
    const { cluster } = await getCouchbaseClient();
    let queryString = "SELECT META().id, * FROM main.play.${pluralLowerCase}";
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
