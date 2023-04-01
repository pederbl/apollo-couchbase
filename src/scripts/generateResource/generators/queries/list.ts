import { ResourceNameForms } from '../../lib/generateResourceNameForms';

export function generateListCode(resourceName: ResourceNameForms) {
  const { singularLowerCase, singularCapitalized, pluralLowerCase } = resourceName;

  return `import { generateId, mutateRecord, mutateRecords, MutationOperation, RecordMutationResult } from "apollo-couch/src/graphql/lib/recordMutation";
import { ${singularCapitalized}CreateInput, RecordsMutationResponse } from "../../../generated-types";

const COLLECTION = "${pluralLowerCase}";
const MUTATION_OPERATION: MutationOperation = "insert";
const COLLECTION_ID_PREFIX = "${singularLowerCase.slice(0, 3)}"

async function recordMutator(record: ${singularCapitalized}CreateInput): 
Promise<RecordMutationResult> {
  const id = generateId(COLLECTION_ID_PREFIX);
  const recordWithId = { ...record, id }
  return mutateRecord(recordWithId, COLLECTION, MUTATION_OPERATION);
}

export default async function resolver(_: any, { records }: { records: ${singularCapitalized}CreateInput[] }): 
Promise<RecordsMutationResponse> {
  return mutateRecords<${singularCapitalized}CreateInput>(records, recordMutator);
}
`;
}