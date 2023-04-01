import { ResourceNameForms } from '../../lib/generateResourceNameForms';

export function generateDeleteCode(resourceName: ResourceNameForms) {
  const { singularCapitalized, pluralLowerCase } = resourceName;

  return `import { mutateRecord, mutateRecords, MutationOperation, RecordMutationResult } from "apollo-couch/src/graphql/lib/recordMutation";
import { ${singularCapitalized}DeleteInput, RecordsMutationResponse } from "../../../generated-types";

const COLLECTION = "${pluralLowerCase}";
const MUTATION_OPERATION: MutationOperation = "delete";

async function recordMutator(record: ${singularCapitalized}DeleteInput): 
Promise<RecordMutationResult> {
  return mutateRecord(record, COLLECTION, MUTATION_OPERATION);
}

export default async function resolver(_: any, { records }: { records: ${singularCapitalized}DeleteInput[] }): 
Promise<RecordsMutationResponse> {
  return mutateRecords<${singularCapitalized}DeleteInput>(records, recordMutator);
}
`;
}