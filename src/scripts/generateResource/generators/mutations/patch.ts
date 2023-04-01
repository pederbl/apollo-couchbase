import { ResourceNameForms } from '../../lib/generateResourceNameForms';

export function generatePatchCode(resourceName: ResourceNameForms) {
  const { singularCapitalized, pluralLowerCase } = resourceName;

  return `import { mutateRecord, mutateRecords, MutationOperation, RecordMutationResult } from "apollo-couch/src/graphql/lib/recordMutation";
import { ${singularCapitalized}PatchInput, RecordsMutationResponse } from "../../../generated-types";

const COLLECTION = "${pluralLowerCase}";
const MUTATION_OPERATION: MutationOperation = "patch";

async function recordMutator(record: ${singularCapitalized}UpdateInput): 
Promise<RecordMutationResult> {
  return mutateRecord(record, COLLECTION, MUTATION_OPERATION);
}

export default async function resolver(_: any, { records }: { records: ${singularCapitalized}UpdateInput[] }): 
Promise<RecordsMutationResponse> {
  return mutateRecords<${singularCapitalized}UpdateInput>(records, recordMutator);
}
`;
}